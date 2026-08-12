---
name: groom-ticket
description: >-
  High-level ticket shaping for backlog-grooming: intention + acceptance criteria.
  Lands work in board Refinement — not Ready.
---

# groom-ticket

## When to use

`/backlog-grooming` when creating or shaping tickets before low-level refinement.

## Goal

Produce **Refinement**-column tickets with clear product intent and testable acceptance criteria. Do **not** require full agent-ready implementation detail here — that is `/refinement`.

## Grooming brief (minimum for Refinement status)

Board issue body should include:

```markdown
## Intention
… why / outcome …

## Acceptance criteria
- [ ] …
- [ ] …

## Notes
… optional context, links, open product questions …
```

Enough that a refinement pass can expand into an agent-ready ticket without re-discovering the problem.

## Steps

1. Read roadmap focus; split/merge/Icebox coarse outcomes.
2. Draft or update board issues with Intention + Acceptance criteria (not full Scope/Constraints/Verification yet).
3. Set board status to `statusIds.refinement` (forge.json). Never place newly groomed work in Ready.
4. Mirror ids under backlog.md `# Refinement`. Keep `# Ready` for post-refinement only.
5. Leave lasting product decisions under HITL **Decisions needed**; park blocked items in Blocked.

## Outputs / stop conditions

Vendor issue upserts + backlog Refinement list. Stop short of claiming implement-ready.
