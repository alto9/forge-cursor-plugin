#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <pr-ref>"
    echo "  pr-ref: GitHub PR URL, owner/repo#123, or PR number"
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

REPO_PATH=""
PR_NUM=""
ARG="${1}"
if [[ "${ARG}" =~ ^https://github.com/([^/]+)/([^/]+)/pull/([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    PR_NUM="${BASH_REMATCH[3]}"
elif [[ "${ARG}" =~ ^([^/]+)/([^/]+)#([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    PR_NUM="${BASH_REMATCH[3]}"
elif [[ "${ARG}" =~ ^[0-9]+$ ]]; then
    PR_NUM="${ARG}"
    if [[ -f "${PROJECT_FILE}" ]]; then
        GITHUB_URL="$(jq -r '.github_url // empty' "${PROJECT_FILE}")"
        REPO_PATH="$(sed -E 's#^https?://github.com/##; s#/$##; s#\.git$##' <<<"${GITHUB_URL}")"
    fi
    if [[ -z "${REPO_PATH}" ]] || [[ "${REPO_PATH}" != *"/"* ]]; then
        echo "Error: could not determine repo from .forge/project.json. Use owner/repo#123 or full URL." >&2
        exit 1
    fi
else
    echo "Error: could not parse PR ref '${ARG}'" >&2
    exit 1
fi

cd "${PROJECT_ROOT}"
gh pr checkout "${PR_NUM}" --repo "${REPO_PATH}"
echo "Checked out PR #${PR_NUM}. Branch ready for review."
