---
name: resolve-paths
description: >-
  Resolve super-repo and event target — product (one submodule) or group (family).
  Outputs product paths and optional groupRoot, or groupId + members[].
---

# resolve-paths

## When to use

Start of every Forge event/command before reading memory or calling vendor.

## Steps

1. Resolve **superRepoRoot**:
   - If `FORGE_SUPER_REPO` is set, use it (must contain `.gitmodules`).
   - Else walk upward from cwd for a directory containing `.gitmodules`.
   - Prefer a root that also has `.ai/memory/` when multiple ancestors match.
   - If zero or ambiguous: **STOP** and ask the orchestrator.
2. Require a memory-repo submodule: `.gitmodules` must include `path = .ai/memory`. If missing: **STOP** and tell the orchestrator to add it (`git submodule add -b main <url> .ai/memory`).
3. Resolve **target** (group or product). Prefer script output. Priority:
   - Explicit `--group <id>` → **group scope** (id from `groups/<id>/group.json`; no hardcoded family names).
   - Explicit `--submodule` / `--product <path>` → **product scope** (path as in `.gitmodules` code list).
   - Bare `--target <name>` → match group id **first**, then exact code path, then unique basename; **STOP** if both a group and a product could apply.
   - Else if cwd is inside `superRepoRoot/<code-gitmodules-path>/` → product scope.
   - Else if cwd is inside `.ai/memory/`, do not treat memory-repo as code; fall through.
   - Else if exactly one code submodule has a tree under `memoryRepoRoot`, use it (product).
   - Else if exactly one code submodule: use it.
   - Else: **STOP** and list groups + code paths for the orchestrator to pick.
4. Derive paths:
   - `memoryRepoRoot = superRepoRoot / .ai/memory`
   - **Product scope:** `submoduleRoot`, `memoryRoot = memoryRepoRoot / submodulePath`; if `forge.json.group` is set, also `groupId` + `groupRoot = memoryRepoRoot / groups / <id>`
   - **Group scope:** `groupId`, `groupRoot`, `members[]` each with `submodulePath`, `submoduleRoot`, `memoryRoot`, `forge` / `kind` — no single `submodulePath`
5. Sanity checks (fail closed): `.gitmodules` exists; memory-repo entry present; group members are code paths; `memoryRoot` under `memoryRepoRoot` (never under `submoduleRoot`); `groups/` is not a code submodule; `submodulePath` is never `.ai/memory`.

## Group vs product behavior (for the parent event)

- **One event, one plan, one target.** A group id is not “run once per member.”
- Family narrative events write group-owned docs under `groupRoot` once when a group is in play.
- Group-owned docs: `marketing/*`, `product/personas.md`, `product/competitive.md`, `design/principles.md`. Standalone products (no `forge.json.group`) keep those under `memoryRoot`.
- Planning launched on a group may list per-member memory/vendor actions in one plan (tag the member).
- Ticket auto-apply (`implement` / `validate` / `respond-to-review`): group is a **search scope**; pin one member once a ticket is chosen. Group + no ticket → fail closed and list matching cards.
- `kind: site`: product-targeted implement/grooming/refinement **stop**; group-targeted ticket events **skip** site members unless they have a board.

## Outputs / stop conditions

Product: `scope=product`, `superRepoRoot`, `submodulePath`, `submoduleRoot`, `memoryRepoRoot`, `memoryRoot`, optional `groupId` / `groupRoot`, `kind`.
Group: `scope=group`, `superRepoRoot`, `memoryRepoRoot`, `groupId`, `groupRoot`, `members[]`.
Stop on ambiguity — never guess. Stop if memory-repo submodule is missing.

## Script

`node scripts/resolve-paths.js [--cwd DIR] [--submodule PATH] [--product PATH] [--group ID] [--target NAME] [--super-repo DIR]`
