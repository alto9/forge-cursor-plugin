---
name: ensure-config
description: >-
  Create or complete memoryRoot/forge.json (required host identity; optional board ids and release.gates).
---

# ensure-config

## When to use

Harness entry when `forge.json` is missing or incomplete (`init-project`, or before board/vendor writes).

## Steps

1. Run **resolve-paths**.
2. Look for `memoryRoot/forge.json`.
3. If missing, create a minimal stub:
   - `version`: 1
   - `path`: frozen to `submodulePath`
   - `host`: github | gitlab
   - host identity: `github.owner` + `github.repo`, or `gitlab.projectId`
4. Conversationally populate with the user: board/project ids, `statusIds`, `release.gates` as needed for this project type.
5. For board sync, map `statusIds` including the grooming→refinement→ready path:
   - `backlog`, `refinement`, `ready`, `in_progress`, `in_review`, `done` (names as keys in forge.json; values = host column/option ids)
   - `refinement` is required for `/backlog-grooming` and `/refinement` board moves
6. Validate required fields always; validate board fields only when the event will sync the board.
7. Do not block non-board events (e.g. architecture-review) on missing `statusIds`.

## Outputs / stop conditions

Valid `forge.json` on disk (or a propose-only stub in HITL when parent owns Apply). Path must match submodulePath.
