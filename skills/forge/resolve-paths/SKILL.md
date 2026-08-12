---
name: resolve-paths
description: >-
  Resolve super-repo and active submodule paths (fail-closed). Outputs superRepoRoot, submodulePath, submoduleRoot, memoryRoot.
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
2. Resolve **submodulePath**:
   - Explicit `--submodule <path>` wins (path as in `.gitmodules`).
   - Else if cwd is inside `superRepoRoot/<gitmodules-path>/`, use that path.
   - Else if exactly one submodule is under both `.gitmodules` and `.ai/memory/`, use it.
   - Else: **STOP** and list `.gitmodules` paths for the orchestrator to pick.
3. Derive:
   - `submoduleRoot = superRepoRoot / submodulePath`
   - `memoryRoot = superRepoRoot / .ai/memory / submodulePath`
4. Sanity checks (fail closed): `.gitmodules` exists; path listed; memoryRoot under `.ai/memory/` (never under submoduleRoot).

## Outputs / stop conditions

Outputs: `superRepoRoot`, `submodulePath`, `submoduleRoot`, `memoryRoot`.
Stop on ambiguity — never guess a submodule.

## Script

`node scripts/resolve-paths.js [--cwd DIR] [--submodule PATH] [--super-repo DIR]`
