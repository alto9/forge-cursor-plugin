#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 [target-project-path]"
    echo
    echo "Scaffold .forge files from skills/init-forge/references/knowledge_map.json."
    echo "If target-project-path is omitted, current working directory is used."
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    usage
    exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
MAP_FILE="${SKILL_ROOT}/references/knowledge_map.json"
SKILL_REGISTRY_ASSET="${SKILL_ROOT}/references/skill_registry.json"
TARGET_ROOT="${1:-$PWD}"

if [[ ! -f "${MAP_FILE}" ]]; then
    echo "Error: knowledge map not found at ${MAP_FILE}" >&2
    exit 1
fi

if [[ ! -f "${SKILL_REGISTRY_ASSET}" ]]; then
    echo "Error: static skill registry asset not found at ${SKILL_REGISTRY_ASSET}" >&2
    exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
    echo "Error: python3 is required but not installed." >&2
    exit 1
fi

python3 - "$MAP_FILE" "$TARGET_ROOT" "$SKILL_REGISTRY_ASSET" <<'PY'
import json
import pathlib
import sys

map_file = pathlib.Path(sys.argv[1]).resolve()
target_root = pathlib.Path(sys.argv[2]).resolve()
skill_registry_asset = pathlib.Path(sys.argv[3]).resolve()

try:
    data = json.loads(map_file.read_text(encoding="utf-8"))
except Exception as exc:
    print(f"Error: failed to read knowledge map: {exc}", file=sys.stderr)
    sys.exit(1)

paths = set()

def collect(node):
    if isinstance(node, str):
        paths.add(node)
        return
    if isinstance(node, list):
        for item in node:
            collect(item)
        return
    if isinstance(node, dict):
        primary = node.get("primary_doc")
        if isinstance(primary, str):
            paths.add(primary)
        children = node.get("children")
        if isinstance(children, list):
            for item in children:
                collect(item)

collect(data.get("knowledge_map", []))

if not paths:
    print("No paths found in knowledge map. Nothing to do.")
    sys.exit(0)

created = []
existing = []
skipped = []

for rel in sorted(paths):
    rel_path = pathlib.Path(rel)

    if rel_path.is_absolute() or ".." in rel_path.parts:
        skipped.append(rel)
        continue

    out_path = (target_root / rel_path).resolve()

    if not str(out_path).startswith(str(target_root)):
        skipped.append(rel)
        continue

    out_path.parent.mkdir(parents=True, exist_ok=True)

    if out_path.exists():
        existing.append(str(out_path.relative_to(target_root)))
        continue

    # .forge/skill_registry.json must come from static asset, not blank template.
    if str(rel_path).replace("\\", "/") == ".forge/skill_registry.json":
        out_path.write_text(skill_registry_asset.read_text(encoding="utf-8"), encoding="utf-8")
        created.append(str(out_path.relative_to(target_root)))
        continue

    if out_path.suffix.lower() == ".json":
        out_path.write_text("{}\n", encoding="utf-8")
    elif out_path.suffix.lower() == ".md":
        out_path.write_text("", encoding="utf-8")
    else:
        out_path.write_text("", encoding="utf-8")

    created.append(str(out_path.relative_to(target_root)))

print(f"Forge init complete in: {target_root}")
print(f"Created files: {len(created)}")
print(f"Existing files: {len(existing)}")
if skipped:
    print(f"Skipped unsafe paths: {len(skipped)}")

if created:
    print("\nCreated:")
    for p in created:
        print(f"  - {p}")
PY
