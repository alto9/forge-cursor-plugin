---
name: vendor-branches-write
description: >-
  Vendor MCP operation: branches / write.
---

# vendor-branches-write

## When to use

Invoked by Forge event commands or agents for `vendor/branches/write`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: create_branch
gitlab MCP: create_branch, delete_branch
```

