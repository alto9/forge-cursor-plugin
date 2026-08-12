---
name: vendor-issues-write
description: >-
  Vendor MCP operation: issues / write (body, status, labels, milestones).
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
github MCP: issue_write (title, body, labels, milestone number); get_label / create_label / list_issue_fields as available
gitlab MCP: create_issue, update_issue, update_issue_description_patch, delete_issue (labels / milestone_id when supported)
```

## Labels

- Readiness labels from forge.json: `labels.aiReady` / `labels.humanReady` (default `ai-ready` / `human-ready`).
- On Ready promotion (`/forge.refinement`): set exactly one readiness label; remove the other if present.
- Ensure labels exist before apply (create via host label API under HITL if missing) — see ensure-config / init-project bootstrap.

## Milestones

- Assign issues to a **host** milestone (GitHub/GitLab) when grouping **5 or more** related actionable tickets.
- Create milestone on the host only when that threshold is met (or reusing an existing matching milestone).
- Never create epic/parent/umbrella issues as a substitute for milestones.
- Include milestone title/number/id in proposed vendor actions; refresh memory `project/milestones.md` to reference host milestone URL + issue ids after Apply.

## Body rules

- Ready issue bodies must be self-contained (no `.ai/memory/…` or `product/specs/…` links). Vendor write persists the board contract as proposed by agent-ready-ticket.
