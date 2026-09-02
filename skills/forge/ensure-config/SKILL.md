---
name: ensure-config
description: >-
  Create or complete memoryRoot/forge.json (required host identity; optional board ids,
  readiness labels, release.gates, group, and kind).
---

# ensure-config

## When to use

Harness entry when `forge.json` is missing or incomplete (`/forge.init-project`, or before board/vendor writes).

## Steps

1. Run **resolve-paths**.
2. Look for `memoryRoot/forge.json` (product scope). For group-only init, ensure `groups/<id>/group.json` instead — see init-project.
3. If missing, create a minimal stub:
   - `version`: 1
   - `path`: frozen to `submodulePath`
   - `host`: github | gitlab
   - host identity: `github.owner` + `github.repo`, or `gitlab.projectId`
   - optional `kind`: `app` (default) | `site` | `library`
   - optional `group`: id matching `.ai/memory/groups/<id>/group.json`
4. Conversationally populate with the user: board/project ids, `statusIds`, `release.gates`, `kind`, and `group` as needed.
5. For board sync (skip when `kind: site` unless the site actually has a board): map `statusIds` including the grooming→refinement→ready→in_progress→in_review→done path:
   - `backlog`, `refinement`, `ready`, `in_progress`, `in_review`, `done` (names as keys in forge.json; values = host column/option ids)
   - `refinement` is required for `/forge.backlog-grooming` and `/forge.refinement` board moves
   - `in_progress` / `in_review` are required for `/forge.implement-ticket` (claim after Ready gate; PR + CI green → In Review)
   - `done` is required for `/forge.validate-ticket` dual-approve board move
6. Ensure readiness label names in forge.json (defaults if omitted):
   - `labels.aiReady`: `"ai-ready"`
   - `labels.humanReady`: `"human-ready"`
   When board/vendor writes are in scope, propose creating these labels on the host if missing (plan Accept before vendor).
7. When `group` is set: verify `groups/<id>/group.json` exists and lists this `path` in `members[]`. Do not invent a group from a filesystem path prefix.
8. Validate required fields always; validate board fields only when the event will sync the board and `kind` is not `site` (unless site has a board).
9. Do not block non-board events (e.g. architecture-review) on missing `statusIds`. Product-targeted implement / grooming / refinement **stop** when `kind: site`.

## Outputs / stop conditions

Valid `forge.json` on disk (or a propose-only stub in the plan when parent owns Apply). Path must match submodulePath. Optional `group` + `kind` as above.
