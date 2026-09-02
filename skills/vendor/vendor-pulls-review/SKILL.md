---
name: vendor-pulls-review
description: >-
  Vendor MCP operation: pulls / review.
---

# vendor-pulls-review

## When to use

Invoked by Forge event commands or agents for `vendor/pulls/review`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in plan delta before mutating unless parent Apply already accepted them, or the parent event is auto-apply (`/forge.validate-ticket`). For validate-ticket: post the required combined PASS/FAIL comment (first line `Forge validate-ticket: PASS` or `FAIL`, then QA and Security verdict lines).

## MCP mapping

```
github MCP: pull_request_review_write, add_comment_to_pending_review, add_reply_to_pull_request_comment
gitlab MCP: mr_discussions, create_merge_request_thread, create_merge_request_note, resolve_merge_request_thread, approve_merge_request, unapprove_merge_request
```

