---
name: commit-memory
description: >-
  After validated memory Apply: commit and push straight to origin/main of the memory-repo (no branches or PRs).
---

# commit-memory

## When to use

Parent Apply phase, **after** writing validated memory files under `memoryRoot` (and only if there were memory edits). Skip if no memory files changed.

## Steps

1. Requires **resolve-paths** (`memoryRepoRoot`). Memory Apply must already have written files under `memoryRoot`.
2. Ensure branch is **`main`**. If not: **STOP**.
3. Stage only paths under `memoryRepoRoot` (`git add` within that repo). Refuse any path that escapes the memory-repo or would touch a code submodule.
4. If nothing to commit: succeed as no-op.
5. `git commit` on `main` with a concise message (e.g. `chore(memory): apply <event-id>`).
6. `git push origin main`. If rejected: `git pull --rebase --autostash origin main` then push again. On conflict: **STOP** for the orchestrator — never create a branch or PR/MR.
7. Do **not** require a super-repo commit of the gitlink after every push (optional later hygiene).

## Rules

- Agent-owned git policy: direct-to-`main` only. No feature branches, no PRs/MRs on the memory-repo.
- Plan Accept still gates *content*; this skill only publishes already-approved Apply writes.
- Subagents never run this; the parent command does after Apply.

## Script

`node scripts/memory-repo-git.js commit --memory-repo-root <memoryRepoRoot> [--message MSG] [--file <relpath>]...`
