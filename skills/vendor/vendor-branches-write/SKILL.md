---
name: vendor-branches-write
description: >-
  Vendor MCP operation: branches / write.
---

# vendor-branches-write

## When to use

Invoked by Forge event commands or agents for `vendor/branches/write`.

1. resolve-paths + resolve-config first. For `/forge.validate-ticket`, skip sync-memory (auto-apply, no memory).
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in plan delta before mutating unless parent Apply already accepted them, or the parent event is auto-apply (`/forge.validate-ticket`).
5. **Memory-repo refuse:** if the target repository is the memory-repo (checkout path `.ai/memory`, or remote URL matching the `.ai/memory` submodule), **STOP**. Never create or delete branches on the memory-repo — memory uses local `commit-memory` on `main` only.
6. **From `/forge.implement-ticket`:** create the remote branch from the fetched **host** default SHA only (via `vendor-branches-write` after local worktree setup). Never create from `issue-(N-1)`, local checkout HEAD, or fork `origin/main` when that remote is not the host.
7. **After `/forge.validate-ticket` merge:** delete the merged PR/MR source/head branch only (auto-Apply after dual approve). Never delete the default or a protected branch. Skip if merge did not succeed.

## MCP mapping

```
github MCP: create_branch (no delete_branch — after merge: `gh api --method DELETE /repos/{owner}/{repo}/git/refs/heads/{branch}`)
gitlab MCP: create_branch, delete_branch
```
