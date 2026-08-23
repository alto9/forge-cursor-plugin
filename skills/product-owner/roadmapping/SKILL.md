---
name: roadmapping
description: >-
  product-owner procedure: roadmapping. Propose-only when spawned from event commands; touch product/ docs via templates.
---

# roadmapping

## When to use

Invoked by Forge event commands or the product-owner agent for `product-owner/roadmapping`.

## Steps

1. Read in-scope memory under `memoryRoot/product/` (and related event Docs). Match templates in `skills/product-owner/templates/`.
2. Put delivery horizons in `product/roadmap.md` frontmatter (`themes`, `now`, `next`, `later`, `not_planning`). Brief `current_focus` and `goals` hold why; roadmap holds sequencing — **roadmap wins on priority**. Body is expansion-only.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Questions, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
