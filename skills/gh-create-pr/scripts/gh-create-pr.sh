#!/usr/bin/env bash

set -euo pipefail

require_command() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: required command '$cmd' is not installed." >&2
        exit 1
    fi
}

require_command gh
require_command git

BASE_BRANCH="${1:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"

cd "${PROJECT_ROOT}"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ -z "${CURRENT_BRANCH}" || "${CURRENT_BRANCH}" == "HEAD" ]]; then
    echo "Error: could not determine current branch." >&2
    exit 1
fi

if [[ -z "${BASE_BRANCH}" ]]; then
    BASE_BRANCH="$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's#^refs/remotes/origin/##' || true)"
fi
if [[ -z "${BASE_BRANCH}" ]]; then
    BASE_BRANCH="main"
fi

if ! git ls-remote --heads origin "${CURRENT_BRANCH}" >/dev/null 2>&1; then
    git push -u origin "${CURRENT_BRANCH}"
fi

gh pr create --base "${BASE_BRANCH}" --head "${CURRENT_BRANCH}" --fill
