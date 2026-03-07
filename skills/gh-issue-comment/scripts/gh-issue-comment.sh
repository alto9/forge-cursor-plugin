#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <issue-ref> <comment>" >&2
    echo "  issue-ref: GitHub URL, owner/repo#123, or issue number" >&2
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

if [[ -z "${1:-}" || -z "${2:-}" ]]; then
    usage
    exit 1
fi

ISSUE_REF="$1"
COMMENT="$2"

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

gh issue comment "${ISSUE_NUM}" --repo "${REPO_PATH}" --body "${COMMENT}"
