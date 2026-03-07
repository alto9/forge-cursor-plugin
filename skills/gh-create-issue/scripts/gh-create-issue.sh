#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${1:-}" ]]; then
    echo "Usage: $0 <title> [body]" >&2
    exit 1
fi

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Error: $1 not installed" >&2
        exit 1
    fi
}

require_command jq
require_command gh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
PROJECT_FILE="${PROJECT_ROOT}/.forge/project.json"

if [[ ! -f "${PROJECT_FILE}" ]]; then
    echo "Error: .forge/project.json not found" >&2
    exit 1
fi

GITHUB_URL="$(jq -r '.github_url // empty' "${PROJECT_FILE}")"
REPO_PATH="$(sed -E 's#^https?://github.com/##; s#/$##; s#\.git$##' <<<"${GITHUB_URL}")"

TITLE="${1}"
BODY="${2:-}"

gh issue create --repo "${REPO_PATH}" --title "${TITLE}" --body "${BODY}"
echo "Issue created."
