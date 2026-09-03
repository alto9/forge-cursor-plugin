---
name: outcome-definition
description: >-
  product-owner procedure: outcome definition. Propose-only when spawned from event commands; touch product/ docs via templates.
---

# outcome-definition

## When to use

Invoked by Forge event commands or the product-owner agent for `product-owner/outcome-definition`.

## Steps

1. Read in-scope memory under `memoryRoot/product/` (and related event Docs). Match templates in `skills/product-owner/templates/`.
2. Put intent/targets in brief frontmatter `goals` and `success_metrics` (`{ metric, target }`); body for nuance only. Keep current readings in `product/metrics.md` (brief = intent; metrics = current read). Other product docs use the same frontmatter pattern.
3. Re-read in-scope docs as of this run; remove stale items; leave files alone only when still true after that judgment (and after any idle AskQuestion the parent must run).
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a plan-delta blob (Intent, Proposed memory edits, Proposed vendor actions, Left alone, Movement). Do **not** Apply, pause with the orchestrator, or mutate SCM. Parent owns idle AskQuestion forks.

## Outputs / stop conditions

Plan-delta blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
