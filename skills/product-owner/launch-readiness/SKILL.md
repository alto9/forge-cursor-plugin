---
name: launch-readiness
description: >-
  product-owner procedure: launch readiness. Propose-only when spawned from event commands; touch product/ docs via templates.
---

# launch-readiness

## When to use

Invoked by Forge event commands or the product-owner agent for `product-owner/launch-readiness`.

## Steps

1. Read in-scope memory under `memoryRoot/product/` (and related event Docs). Match templates in `skills/product-owner/templates/`.
2. Propose updates to product docs via YAML frontmatter schemas (`doc: product.*`, schema_version 1); body is expansion-only; bump `updated` when frontmatter changes; empty fields OK.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a plan-delta blob (Intent, Proposed memory edits, Proposed vendor actions, Left alone). Do **not** Apply, pause with the orchestrator, or mutate SCM.

## Outputs / stop conditions

Plan-delta blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
