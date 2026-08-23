---
name: groom-ticket
description: >-
  High-level ticket shaping for backlog-grooming: intention + acceptance criteria.
  Lands work in board Refinement — not Ready. No epic tickets; host milestones for 5+ groups.
---

# groom-ticket

## When to use

`/forge.backlog-grooming` when creating or shaping tickets before low-level refinement. Active submodule only — one project per invocation.

## Goal

Produce **Refinement**-column tickets with clear product intent and testable acceptance criteria. Do **not** require full Ready implementation detail here — that is `/forge.refinement`.

**Tickets are always actionable** (one implementable/doable unit). Never create epic, parent, or umbrella issues.

## Grooming brief (minimum for Refinement status)

Board issue body should include:

```markdown
## Intention
… why / outcome …

## Acceptance criteria
- [ ] …
- [ ] …

## Notes
… optional context, open product questions …
```

Enough that a refinement pass can expand into a Ready ticket without re-discovering the problem. Notes may hold open questions; do **not** use Notes for durable “see memory file X” pointers that would survive into Ready.

## Host milestones (grouping)

- If a theme/outcome would spawn **5 or more** related actionable tickets, create or reuse a **host milestone** (GitHub/GitLab) and assign those issues to it via vendor-issues-write.
- Fewer than 5 related tickets: leave ungrouped (roadmap Themes/Now is enough) — do **not** invent a milestone for a small cluster.
- Never substitute an epic/parent issue for a milestone.

## Steps

1. Read roadmap focus; split/merge/Icebox coarse outcomes into **actionable** tickets only.
2. Draft or update board issues with Intention + Acceptance criteria (not full Scope/Constraints/Verification yet).
3. When splitting into ≥5 related tickets, propose host milestone create/reuse + assign.
4. Set board status to `statusIds.refinement` (forge.json). Never place newly groomed work in Ready. Do not apply `ai-ready` / `human-ready` here.
5. Mirror ids under backlog.md `# Refinement`. Keep `# Ready` for post-refinement only.
6. Leave lasting product decisions under HITL **Questions**; park blocked items in Blocked.

## Outputs / stop conditions

Vendor issue upserts (+ optional milestone ops) + backlog Refinement list. Stop short of claiming implement-ready.
