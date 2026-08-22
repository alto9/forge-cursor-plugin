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
2. For `product/brief.md`: put intent/targets in frontmatter `goals` and `success_metrics` (`{ metric, target }`); body for nuance only. Keep current readings in `product/metrics.md` (brief = intent; metrics = current read). For other product docs: required H2s only; empty sections OK; no extra H2s.
3. Current state only — remove stale items; leave files alone if unchanged. Bump brief `updated` when any frontmatter field changes.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Questions, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
