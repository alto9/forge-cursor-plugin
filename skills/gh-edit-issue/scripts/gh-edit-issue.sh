#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <issue-ref> [--title \"New title\"] [--body \"New body\"] [--state open|closed]" >&2
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
shift

TITLE=""
BODY=""
STATE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --title)
            TITLE="${2:-}"
            shift 2
            ;;
        --body)
            BODY="${2:-}"
            shift 2
            ;;
        --state)
            STATE="${2:-}"
            shift 2
            ;;
        *)
            echo "Error: unknown option '$1'" >&2
            usage
            exit 1
            ;;
    esac
done

if [[ -z "${TITLE}" && -z "${BODY}" && -z "${STATE}" ]]; then
    echo "Error: provide at least one of --title, --body, --state" >&2
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

ARGS=(issue edit "${ISSUE_NUM}" --repo "${REPO_PATH}")
if [[ -n "${TITLE}" ]]; then
    ARGS+=(--title "${TITLE}")
fi
if [[ -n "${BODY}" ]]; then
    ARGS+=(--body "${BODY}")
fi
if [[ -n "${STATE}" ]]; then
    ARGS+=(--state "${STATE}")
fi

gh "${ARGS[@]}"
