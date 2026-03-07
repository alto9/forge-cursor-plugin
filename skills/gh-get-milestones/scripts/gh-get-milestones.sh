#!/usr/bin/env bash

set -euo pipefail

require_command() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: required command '$cmd' is not installed." >&2
        exit 1
    fi
}

require_command jq
require_command gh

STATE="${1:-all}"
PER_PAGE="${2:-100}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
PROJECT_FILE="${PROJECT_ROOT}/.forge/project.json"

if [[ ! -f "${PROJECT_FILE}" ]]; then
    echo "Error: .forge/project.json not found at ${PROJECT_FILE}" >&2
    exit 1
fi

GITHUB_URL="$(jq -r '.github_url // empty' "${PROJECT_FILE}")"
REPO_PATH="$(sed -E 's#^https?://github.com/##; s#/$##; s#\.git$##' <<<"${GITHUB_URL}")"

if [[ "${REPO_PATH}" != */* ]]; then
    echo "Error: could not parse owner/repo from github_url '${GITHUB_URL}'" >&2
    exit 1
fi

gh api "repos/${REPO_PATH}/milestones?state=${STATE}&per_page=${PER_PAGE}"
