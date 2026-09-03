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

- **Initiative LLD:** always create/reuse **one host milestone per initiative** (see split-initiative) and assign all its tickets — regardless of count.
- **Legacy (no initiative):** If a theme/outcome would spawn **5 or more** related actionable tickets, create or reuse a **host milestone** and assign those issues. Fewer than 5: leave ungrouped.
- Never substitute an epic/parent issue for a milestone.

## Steps

1. Prefer splitting `status: lld` initiatives via **split-initiative**. If none are `lld`, re-read Icebox / Now / Later as of this run and split/merge coarse outcomes into **actionable** tickets only. When Refinement is empty and only Icebox/Later holds work, the parent must AskQuestion (list titles, recommended pick, stay put) before CreatePlan — do not return an empty grooming plan as success. Do not invent tickets from fog.
2. Draft or update board issues with Intention + Acceptance criteria (not full Scope/Constraints/Verification yet). For initiatives, derive AC from `initiative.feature` scenario groups.
3. Apply milestone rules above.
4. Set board status to `statusIds.refinement` (forge.json). Never place newly groomed work in Ready. Do not apply `ai-ready` / `human-ready` here.
5. Mirror ids under backlog.md `# Refinement`. Keep `# Ready` for post-refinement only.
6. Leave lasting product decisions via AskQuestion in Plan; park blocked items in Blocked. Include Movement in the plan-delta blob (what advanced, or operator-confirmed stay-put).

## Outputs / stop conditions

Vendor issue upserts (+ optional milestone ops) + backlog Refinement list, or parent idle AskQuestion when nothing to groom. Stop short of claiming implement-ready.
