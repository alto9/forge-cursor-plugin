---
name: resolve-config
description: >-
  Load forge.json after resolve-paths. Product: memoryRoot/forge.json. Group: each member’s forge.json.
  Exposes host identity, status map, kind, group, and release.gates.
---

# resolve-config

## When to use

After resolve-paths, before vendor skills or board-sync events.

## Steps

1. Requires **resolve-paths** first. For pausing events, Prefer Plan without `sync-memory`; Apply pulls then. When reading config during Apply, ensure memory is synced.
2. **Product scope:** Read `memoryRoot/forge.json`. If missing, run **ensure-config** (or stop and tell orchestrator to run `/forge.init-project`). Ensure `forge.json.path` equals `submodulePath`. Expose `host`, identity, optional `statusIds`, labels, `release.gates`, `kind`, `group` / `groupRoot`.
3. **Group scope:** For each `members[]` entry, read that member’s `forge.json` (skip missing with a plan note). Expose per-member host/board config. Family narrative events may only need `groupRoot` docs.
4. Vendor identity comes from forge.json — remotes may inform ensure-config only; they are not authority.
5. `kind: site`: do not require board fields; product-targeted ticket events stop.

## Outputs / stop conditions

Parsed forge config for the active product, or per-member configs for a group target. Fail closed if required fields missing for the operation (board fields only when the event writes the board and kind is not site).
