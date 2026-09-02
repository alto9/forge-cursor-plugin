---
name: sync-memory
description: >-
  Pull latest origin/main of the .ai/memory memory-repo before any memory read (fail-closed).
---

# sync-memory

## When to use

After **resolve-paths**, before **resolve-config** or any memory read. Parent event commands must run this every time.

## Steps

1. Requires **resolve-paths** first (`memoryRepoRoot` = `superRepoRoot / .ai/memory`).
2. Ensure `memoryRepoRoot` is a git checkout (submodule initialized). If not: **STOP** and tell the orchestrator to init/update the `.ai/memory` submodule.
3. Ensure branch is **`main`** when the repo has commits. If detached, attempt `git checkout main`. If on another branch: **STOP** (do not create branches). Empty repos (no commits / no `origin/main` yet) are OK — proceed so `/forge.init-project` can seed and `commit-memory` can publish the first push.
4. When `origin/main` exists: `git pull --ff-only origin main`. On non-ff failure: **STOP** for the orchestrator — never create a branch to resolve it.
5. Proceed only when local `main` matches (or is behind and was fast-forwarded to) `origin/main`, or the remote has no `main` yet.

## Rules

- Super-repo gitlink SHA is a **hint only** — always sync to `origin/main`, not `git submodule update` to a stale pin.
- Subagents do not run this; the parent command does.
- Never open PRs/MRs against the memory-repo.

## Script

`node scripts/memory-repo-git.js sync --memory-repo-root <memoryRepoRoot>`
