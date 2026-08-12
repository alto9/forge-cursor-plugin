---
name: resolve-config
description: >-
  Load memoryRoot/forge.json after resolve-paths. Exposes host identity, status map, and release.gates for vendor and events.
---

# resolve-config

## When to use

After resolve-paths, before vendor skills or board-sync events.

## Steps

1. Requires **resolve-paths** first.
2. Read `memoryRoot/forge.json`. If missing, run **ensure-config** (or stop and tell orchestrator to run `/forge.init-project`).
3. Ensure `forge.json.path` equals `submodulePath`.
4. Expose: `host`, github/gitlab identity, optional `statusIds`, optional `labels.aiReady` / `labels.humanReady` (default `ai-ready` / `human-ready`), optional `release.gates`.
5. Vendor identity comes from forge.json — remotes may inform ensure-config only; they are not authority.

## Outputs / stop conditions

Parsed forge config for the active submodule. Fail closed if required fields missing for the operation (board fields only when the event writes the board).
