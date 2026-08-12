---
name: vendor-pulls-list
description: >-
  Vendor MCP operation: pulls / list.
---

# vendor-pulls-list

## When to use

Invoked by Forge event commands or agents for `vendor/pulls/list`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: list_pull_requests, search_pull_requests
gitlab MCP: list_merge_requests
```

