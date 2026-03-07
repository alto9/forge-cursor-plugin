#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"

cd "${PROJECT_ROOT}"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "${BRANCH}" == "main" ]] || [[ "${BRANCH}" == "master" ]] || [[ "${BRANCH}" == "develop" ]]; then
    echo "Error: cannot push main branch directly." >&2
    exit 1
fi

git fetch origin
if ! git ls-remote --heads origin "${BRANCH}" | grep -q .; then
    git push -u origin HEAD
else
    git push origin HEAD
fi
echo "Pushed successfully."
