---
name: vendor-branches-write
description: >-
  Vendor MCP operation: branches / write.
---

# vendor-branches-write

## When to use

Invoked by Forge event commands or agents for `vendor/branches/write`.

1. resolve-paths + sync-memory + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.
5. **Memory-repo refuse:** if the target repository is the memory-repo (checkout path `.ai/memory`, or remote URL matching the `.ai/memory` submodule), **STOP**. Never create or delete branches on the memory-repo — memory uses local `commit-memory` on `main` only.
6. **After `/forge.validate-ticket` merge:** delete the merged PR/MR source/head branch only. Never delete the default or a protected branch. Skip if merge did not succeed.

## MCP mapping

```
github MCP: create_branch (no delete_branch — after merge: `gh api --method DELETE /repos/{owner}/{repo}/git/refs/heads/{branch}`)
gitlab MCP: create_branch, delete_branch
```
