---
name: init-forge
description: [git_flow|forge-bootstrap] Scaffold .forge structure from skill-local knowledge map
---

# Init Forge

Use the provided script to create the `.forge` folder and file structure defined in `references/knowledge_map.json`.

## What It Does

- Reads `references/knowledge_map.json` from this skill.
- Collects all `primary_doc` and child file paths in the map.
- Creates directories and files in the target project.
- Creates blank templates by file type:
  - `.json` -> `{}` + trailing newline
  - `.md` -> blank file
- Special case: `.forge/skill_registry.json` is created from `references/skill_registry.json` (full static asset).
- Does not overwrite existing files.

## Usage

Run the script:

`bash scripts/init-forge.sh [target-project-path]`

- `target-project-path` is optional.
- If omitted, the script uses the current working directory.
