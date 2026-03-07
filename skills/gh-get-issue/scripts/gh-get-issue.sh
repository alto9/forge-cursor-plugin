#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <issue-ref>"
    echo "  issue-ref: GitHub URL, owner/repo#123, or issue number"
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
PROJECT_FILE="${PROJECT_ROOT}/.forge/project.json"

if [[ ! -f "${PROJECT_FILE}" ]]; then
    echo "Error: .forge/project.json not found" >&2
    exit 1
fi

GITHUB_URL="$(jq -r '.github_url // empty' "${PROJECT_FILE}")"
REPO_PATH="$(sed -E 's#^https?://github.com/##; s#/$##; s#\.git$##' <<<"${GITHUB_URL}")"

ARG="${1}"
if [[ "${ARG}" =~ ^https://github.com/([^/]+)/([^/]+)/issues/([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    ISSUE_NUM="${BASH_REMATCH[3]}"
elif [[ "${ARG}" =~ ^([^/]+)/([^/]+)#([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    ISSUE_NUM="${BASH_REMATCH[3]}"
elif [[ "${ARG}" =~ ^[0-9]+$ ]]; then
    ISSUE_NUM="${ARG}"
else
    echo "Error: could not parse issue ref '${ARG}'" >&2
    exit 1
fi

ISSUE_JSON="$(gh issue view "${ISSUE_NUM}" --repo "${REPO_PATH}" --json number,title,body,labels,state 2>/dev/null)" || {
    echo "Error: could not fetch issue ${ISSUE_NUM}" >&2
    exit 1
}

PARENT_NUM=""
PARENT_TITLE=""
IS_SUB="false"
ROOT_BRANCH="main"

if PARENT_JSON="$(gh api "repos/${REPO_PATH}/issues/${ISSUE_NUM}/parent" 2>/dev/null)"; then
    IS_SUB="true"
    PARENT_NUM="$(jq -r '.number' <<<"${PARENT_JSON}")"
    PARENT_TITLE="$(jq -r '.title' <<<"${PARENT_JSON}")"
    ROOT_BRANCH="feature/issue-${PARENT_NUM}"
fi

DEFAULT_BRANCH="$(git -C "${PROJECT_ROOT}" symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's#^refs/remotes/origin/##' || echo "main")"
if [[ "${IS_SUB}" == "false" ]]; then
    ROOT_BRANCH="${DEFAULT_BRANCH}"
fi

jq -n \
    --argjson issue "${ISSUE_JSON}" \
    --arg is_sub "${IS_SUB}" \
    --arg parent_num "${PARENT_NUM}" \
    --arg parent_title "${PARENT_TITLE}" \
    --arg root_branch "${ROOT_BRANCH}" \
    '$issue + { is_sub_issue: ($is_sub == "true"), parent_number: $parent_num, parent_title: $parent_title, root_branch: $root_branch }'
