#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${1:-}" ]]; then
    echo "Usage: $0 <branch-name> [root-branch]"
    exit 1
fi

BRANCH_NAME="${1}"
ROOT_BRANCH="${2:-main}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"

cd "${PROJECT_ROOT}"
git checkout "${ROOT_BRANCH}"
git pull
git checkout -b "${BRANCH_NAME}"

echo "${BRANCH_NAME}"
