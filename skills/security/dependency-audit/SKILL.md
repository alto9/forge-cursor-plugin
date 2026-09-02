---
name: dependency-audit
description: >-
  security procedure: dependency audit. Propose-only when spawned from event commands; touch security/ docs via templates.
---

# dependency-audit

## When to use

Invoked by Forge event commands or the security agent for `security/dependency-audit`.

## Steps

1. Read in-scope memory under `memoryRoot/security/` (and related event Docs). Match templates in `skills/security/templates/`.
2. Propose updates via YAML frontmatter schemas (role template `doc` + schema_version 1); body is expansion-only; bump `updated` when frontmatter changes; empty fields OK.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a plan-delta blob (Intent, Proposed memory edits, Proposed vendor actions, Left alone). Do **not** Apply, pause with the orchestrator, or mutate SCM.

## Outputs / stop conditions

Plan-delta blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
