#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
PROJECT_FILE="${PROJECT_ROOT}/.forge/project.json"

if [[ ! -f "${PROJECT_FILE}" ]]; then
    echo "Error: .forge/project.json not found" >&2
    exit 1
fi

CODE_PATH="$(jq -r '.code_path // "."' "${PROJECT_FILE}")"
if [[ "${CODE_PATH}" == "."* ]] || [[ "${CODE_PATH}" != /* ]]; then
    CODE_PATH="${PROJECT_ROOT}/${CODE_PATH#./}"
fi

cd "${CODE_PATH}"

DEFAULT_BRANCH="$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's#^refs/remotes/origin/##' || echo "main")"
git checkout "${DEFAULT_BRANCH}"
git pull

if [[ -f "pnpm-lock.yaml" ]]; then
    pnpm i
elif [[ -f "yarn.lock" ]]; then
    yarn install
else
    npm i
fi

echo "Ready. On ${DEFAULT_BRANCH}, up to date, dependencies installed."
