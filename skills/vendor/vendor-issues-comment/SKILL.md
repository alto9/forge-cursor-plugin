---
name: vendor-issues-comment
description: >-
  Vendor MCP operation: issues / comment.
---

# vendor-issues-comment

## When to use

Invoked by Forge event commands or agents for `vendor/issues/comment`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: add_issue_comment
gitlab MCP: create_issue_note, update_issue_note, list_issue_discussions
```

