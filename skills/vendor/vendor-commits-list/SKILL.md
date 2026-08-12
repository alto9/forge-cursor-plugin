---
name: vendor-commits-list
description: >-
  Vendor MCP operation: commits / list.
---

# vendor-commits-list

## When to use

Invoked by Forge event commands or agents for `vendor/commits/list`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: list_commits, search_commits, get_commit
gitlab MCP: list_commits, get_commit, get_commit_diff
```

