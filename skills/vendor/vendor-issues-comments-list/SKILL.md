---
name: vendor-issues-comments-list
description: >-
  Vendor MCP operation: list issue comments / notes (read).
---

# vendor-issues-comments-list

## When to use

Invoked by Forge event commands or agents for `vendor/issues/comments-list` — e.g. `/forge.implement-ticket` loading a tech spec comment, or `/forge.refinement` checking for an existing `<!-- forge-tech-spec -->` comment.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Read-only — do not post or edit comments here (use `vendor-issues-comment` for writes).

## MCP mapping

```
github MCP: issue_read (method that lists issue comments)
gitlab MCP: list_issue_discussions
```

## Tech spec lookup

When searching for a Forge tech spec: find the **newest** comment whose body contains `<!-- forge-tech-spec` (marker `<!-- forge-tech-spec:v1 -->` or compatible). Newest match wins.
