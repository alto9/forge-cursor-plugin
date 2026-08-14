---
name: vendor-pulls-write
description: >-
  Vendor MCP operation: pulls / write.
---

# vendor-pulls-write

## When to use

Invoked by Forge event commands or agents for `vendor/pulls/write`.

1. resolve-paths + sync-memory + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.
5. **Memory-repo refuse:** if the target repository is the memory-repo (checkout path `.ai/memory`, or remote URL matching the `.ai/memory` submodule), **STOP**. Never open or update PRs/MRs against the memory-repo — memory uses local `commit-memory` on `main` only.

## MCP mapping

```
github MCP: create_pull_request, update_pull_request, update_pull_request_branch
gitlab MCP: create_merge_request, update_merge_request
```
