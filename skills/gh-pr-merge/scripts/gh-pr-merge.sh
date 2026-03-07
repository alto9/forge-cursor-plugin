#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <pr-ref> [merge|squash|rebase]" >&2
    echo "  pr-ref: GitHub PR URL, owner/repo#123, or PR number" >&2
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

PR_REF="$1"
STRATEGY="${2:-squash}"

case "${STRATEGY}" in
    merge|squash|rebase) ;;
    *)
        echo "Error: merge strategy must be one of merge|squash|rebase" >&2
        exit 1
        ;;
esac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
PROJECT_FILE="${PROJECT_ROOT}/.forge/project.json"

REPO_PATH=""
PR_NUM=""

if [[ "${PR_REF}" =~ ^https://github.com/([^/]+)/([^/]+)/pull/([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    PR_NUM="${BASH_REMATCH[3]}"
elif [[ "${PR_REF}" =~ ^([^/]+)/([^/]+)#([0-9]+) ]]; then
    REPO_PATH="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    PR_NUM="${BASH_REMATCH[3]}"
elif [[ "${PR_REF}" =~ ^[0-9]+$ ]]; then
    PR_NUM="${PR_REF}"
    if [[ -f "${PROJECT_FILE}" ]]; then
        GITHUB_URL="$(jq -r '.github_url // empty' "${PROJECT_FILE}")"
        REPO_PATH="$(sed -E 's#^https?://github.com/##; s#/$##; s#\.git$##' <<<"${GITHUB_URL}")"
    fi
    if [[ -z "${REPO_PATH}" ]] || [[ "${REPO_PATH}" != */* ]]; then
        echo "Error: could not determine repo from .forge/project.json. Use owner/repo#123 or full URL." >&2
        exit 1
    fi
else
    echo "Error: could not parse PR ref '${PR_REF}'" >&2
    exit 1
fi

MERGE_FLAG="--squash"
if [[ "${STRATEGY}" == "merge" ]]; then
    MERGE_FLAG="--merge"
elif [[ "${STRATEGY}" == "rebase" ]]; then
    MERGE_FLAG="--rebase"
fi

gh pr merge "${PR_NUM}" --repo "${REPO_PATH}" "${MERGE_FLAG}"
