#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"

cd "${PROJECT_ROOT}"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "${BRANCH}" == "main" ]] || [[ "${BRANCH}" == "master" ]] || [[ "${BRANCH}" == "develop" ]]; then
    echo "Error: cannot commit on main branch. Create a feature branch first." >&2
    exit 1
fi

if [[ "${1:-}" == "-m" ]] && [[ -n "${2:-}" ]]; then
    MSG="${2}"
else
    echo "Error: pass commit message with -m "message"" >&2
    exit 1
fi

[[ -d .git/hooks ]] && [[ -f .git/hooks/pre-commit ]] && .git/hooks/pre-commit || true
command -v npm >/dev/null 2>&1 && npm run lint 2>/dev/null || true
command -v npm >/dev/null 2>&1 && npm run test 2>/dev/null || true

git add -A
git status
git commit -m "${MSG}"
echo "Committed successfully."
