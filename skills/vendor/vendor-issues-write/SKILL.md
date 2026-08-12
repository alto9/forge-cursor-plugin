---
name: vendor-issues-write
description: >-
  Vendor MCP operation: issues / write.
---

# vendor-issues-write

## When to use

Invoked by Forge event commands or agents for `vendor/issues/write`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: issue_write
gitlab MCP: create_issue, update_issue, update_issue_description_patch, delete_issue
```

