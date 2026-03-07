#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0"
    echo "Pushes milestones from .forge/roadmap.json to the GitHub repo using gh api"
}

require_command() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: required command '$cmd' is not installed." >&2
        exit 1
    fi
}

require_command jq
require_command gh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
PROJECT_FILE="${PROJECT_ROOT}/.forge/project.json"

if [[ ! -f "${PROJECT_FILE}" ]]; then
    echo "Error: .forge/project.json not found at ${PROJECT_FILE}" >&2
    exit 1
fi

PROJECT_JSON="$(jq -c '.' "${PROJECT_FILE}")"
GITHUB_URL="$(jq -r '.github_url // empty' <<<"${PROJECT_JSON}")"
if [[ -z "${GITHUB_URL}" ]]; then
    echo "Error: project does not have a github_url in .forge/project.json" >&2
    exit 1
fi

METADATA_PATH_RAW="$(jq -r '.metadata_path // ".forge"' <<<"${PROJECT_JSON}")"
if [[ "${METADATA_PATH_RAW}" == "~"* ]]; then
    METADATA_PATH="${HOME}${METADATA_PATH_RAW:1}"
elif [[ "${METADATA_PATH_RAW}" == "."* ]] || [[ "${METADATA_PATH_RAW}" != /* ]]; then
    METADATA_PATH="${PROJECT_ROOT}/${METADATA_PATH_RAW#./}"
else
    METADATA_PATH="${METADATA_PATH_RAW}"
fi

ROADMAP_FILE="${METADATA_PATH}/roadmap.json"
if [[ ! -f "${ROADMAP_FILE}" ]]; then
    echo "Error: roadmap file not found at ${ROADMAP_FILE}" >&2
    exit 1
fi

REPO_PATH="$(sed -E 's#^https?://github.com/##; s#/$##; s#\.git$##' <<<"${GITHUB_URL}")"
if [[ "${REPO_PATH}" != */* ]]; then
    echo "Error: could not parse owner/repo from github_url '${GITHUB_URL}'" >&2
    exit 1
fi

LOCAL_MILESTONES="$(
    jq -c '
      (.roadmap.milestones // [])
      | map(
          {
            id: ((.id // "") | tostring),
            title: (.title // ""),
            description: (.description // ""),
            due_date: (.due_date // "")
          }
        )
      | map(select(.title != ""))
    ' "${ROADMAP_FILE}"
)"

echo "Pushing milestones to ${REPO_PATH}..."
REMOTE_MILESTONES="$(gh api "repos/${REPO_PATH}/milestones?state=all&per_page=100")"

TOTAL_LOCAL="$(jq 'length' <<<"${LOCAL_MILESTONES}")"
if [[ "${TOTAL_LOCAL}" -eq 0 ]]; then
    echo "No local milestones with titles found in ${ROADMAP_FILE}. Nothing to push."
    exit 0
fi

for ((i = 0; i < TOTAL_LOCAL; i++)); do
    LOCAL_ROW="$(jq -c ".[$i]" <<<"${LOCAL_MILESTONES}")"
    LOCAL_ID="$(jq -r '.id // ""' <<<"${LOCAL_ROW}")"
    TITLE="$(jq -r '.title // ""' <<<"${LOCAL_ROW}")"
    DESCRIPTION="$(jq -r '.description // ""' <<<"${LOCAL_ROW}")"
    DUE_DATE="$(jq -r '.due_date // ""' <<<"${LOCAL_ROW}")"

    TARGET_NUMBER=""
    if [[ -n "${LOCAL_ID}" ]]; then
        TARGET_NUMBER="$(jq -r --arg id "${LOCAL_ID}" 'map(select((.number | tostring) == $id) | .number) | .[0] // ""' <<<"${REMOTE_MILESTONES}")"
    fi
    if [[ -z "${TARGET_NUMBER}" ]]; then
        TARGET_NUMBER="$(jq -r --arg title "${TITLE}" 'map(select(.title == $title) | .number) | .[0] // ""' <<<"${REMOTE_MILESTONES}")"
    fi

    PAYLOAD="$(jq -cn --arg title "${TITLE}" --arg description "${DESCRIPTION}" --arg due "${DUE_DATE}" '
      { title: $title, description: $description } + (if $due == "" then { due_on: null } else { due_on: ($due + "T00:00:00Z") } end)
    ')"

    if [[ -n "${TARGET_NUMBER}" ]]; then
        echo "Updating milestone #${TARGET_NUMBER}: ${TITLE}"
        gh api --method PATCH "repos/${REPO_PATH}/milestones/${TARGET_NUMBER}" --input - <<<"${PAYLOAD}" >/dev/null
    else
        echo "Creating milestone: ${TITLE}"
        CREATED="$(gh api --method POST "repos/${REPO_PATH}/milestones" --input - <<<"${PAYLOAD}")"
        LOCAL_ID="$(jq -r '.number' <<<"${CREATED}")"
    fi

    ROADMAP_JSON="$(jq -c '.' "${ROADMAP_FILE}")"
    UPDATED_ROADMAP_JSON="$(jq --arg title "${TITLE}" --arg id "${LOCAL_ID}" '
      .roadmap.milestones |= map(if .title == $title then . + { id: $id } else . end)
    ' <<<"${ROADMAP_JSON}")"
    jq '.' <<<"${UPDATED_ROADMAP_JSON}" >"${ROADMAP_FILE}"

    REMOTE_MILESTONES="$(gh api "repos/${REPO_PATH}/milestones?state=all&per_page=100")"
done

echo "Milestone push complete. Updated local IDs in ${ROADMAP_FILE}."
