---
name: vendor-pulls-get
description: >-
  Vendor MCP operation: pulls / get.
---

# vendor-pulls-get

## When to use

Invoked by Forge event commands or agents for `vendor/pulls/get`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in plan delta before mutating unless parent Apply already accepted them.

## MCP mapping

```
github MCP: pull_request_read
gitlab MCP: get_merge_request, get_merge_request_diffs, list_merge_request_changed_files
```

