---
name: resolve-paths
description: >-
  Resolve super-repo and active submodule paths (fail-closed). Outputs superRepoRoot, submodulePath, submoduleRoot, memoryRepoRoot, memoryRoot.
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
3. Resolve **submodulePath** (code only — never `.ai/memory`):
   - Explicit `--submodule <path>` wins (path as in `.gitmodules` code list).
   - Else if cwd is inside `superRepoRoot/<code-gitmodules-path>/`, use that path.
   - Else if cwd is inside `.ai/memory/`, do not treat memory-repo as code; fall through.
   - Else if exactly one code submodule has a tree under `memoryRepoRoot`, use it.
   - Else if exactly one code submodule: use it.
   - Else: **STOP** and list code `.gitmodules` paths for the orchestrator to pick.
4. Derive:
   - `memoryRepoRoot = superRepoRoot / .ai/memory`
   - `submoduleRoot = superRepoRoot / submodulePath`
   - `memoryRoot = memoryRepoRoot / submodulePath`
5. Sanity checks (fail closed): `.gitmodules` exists; code path listed; memory-repo entry present; `memoryRoot` under `memoryRepoRoot` (never under `submoduleRoot`); `submodulePath` is never `.ai/memory`.

## Outputs / stop conditions

Outputs: `superRepoRoot`, `submodulePath`, `submoduleRoot`, `memoryRepoRoot`, `memoryRoot`.
One invocation resolves **one** active submodule. Do not iterate remaining code submodules or remaining `forge.json` files. If the orchestrator wants the same event on every configured project, they invoke the command once per path (`--submodule` or cwd).
Stop on ambiguity — never guess a submodule. Stop if memory-repo submodule is missing.

## Script

`node scripts/resolve-paths.js [--cwd DIR] [--submodule PATH] [--super-repo DIR]`
