#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <issue-ref> [project-url]" >&2
    echo "  issue-ref: issue URL, owner/repo#123, or issue number" >&2
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

if [[ -z "${1:-}" ]]; then
    usage
    exit 1
fi

ISSUE_REF="$1"
PROJECT_URL_ARG="${2:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
PROJECT_FILE="${PROJECT_ROOT}/.forge/project.json"

if [[ ! -f "${PROJECT_FILE}" ]]; then
    echo "Error: .forge/project.json not found" >&2
    exit 1
fi

GITHUB_URL="$(jq -r '.github_url // empty' "${PROJECT_FILE}")"
REPO_PATH="$(sed -E 's#^https?://github.com/##; s#/$##; s#\.git$##' <<<"${GITHUB_URL}")"

if [[ "${ISSUE_REF}" =~ ^https://github.com/([^/]+)/([^/]+)/issues/([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    ISSUE_NUM="${BASH_REMATCH[3]}"
elif [[ "${ISSUE_REF}" =~ ^([^/]+)/([^/]+)#([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    ISSUE_NUM="${BASH_REMATCH[3]}"
elif [[ "${ISSUE_REF}" =~ ^[0-9]+$ ]]; then
    ISSUE_NUM="${ISSUE_REF}"
else
    echo "Error: could not parse issue ref '${ISSUE_REF}'" >&2
    exit 1
fi

ISSUE_URL="$(gh issue view "${ISSUE_NUM}" --repo "${REPO_PATH}" --json url -q .url)"

PROJECT_URL="${PROJECT_URL_ARG}"
if [[ -z "${PROJECT_URL}" ]]; then
    PROJECT_URL="$(jq -r '.github_board // empty' "${PROJECT_FILE}")"
fi

if [[ -z "${PROJECT_URL}" ]]; then
    echo "Error: no project URL provided and .forge/project.json.github_board is empty" >&2
    exit 1
fi

if [[ "${PROJECT_URL}" =~ ^https://github.com/(orgs|users)/([^/]+)/projects/([0-9]+)$ ]]; then
    OWNER="${BASH_REMATCH[2]}"
    PROJECT_NUMBER="${BASH_REMATCH[3]}"
else
    echo "Error: unsupported project URL format '${PROJECT_URL}'" >&2
    echo "Expected: https://github.com/orgs/<owner>/projects/<number>" >&2
    exit 1
fi

gh project item-add "${PROJECT_NUMBER}" --owner "${OWNER}" --url "${ISSUE_URL}"
echo "Added ${ISSUE_URL} to project ${OWNER}/${PROJECT_NUMBER}."
