---
name: reproduce-bug
description: >-
  quality-assurance procedure: reproduce bug. Propose-only when spawned from event commands; touch qa/ docs via templates.
---

# reproduce-bug

## When to use

Invoked by Forge event commands or the quality-assurance agent for `quality-assurance/reproduce-bug`.

## Steps

1. Read in-scope memory under `memoryRoot/qa/` (and related event Docs). Match templates in `skills/quality-assurance/templates/`.
2. Propose updates via YAML frontmatter schemas (role template `doc` + schema_version 1); body is expansion-only; bump `updated` when frontmatter changes; empty fields OK.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a plan-delta blob (Intent, Proposed memory edits, Proposed vendor actions, Left alone). Do **not** Apply, pause with the orchestrator, or mutate SCM.

## Outputs / stop conditions

Plan-delta blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
