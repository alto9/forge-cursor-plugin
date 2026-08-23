---
name: spike-framing
description: >-
  architect procedure: spike framing. Propose-only when spawned from event commands; touch architecture/ docs via templates.
---

# spike-framing

## When to use

Invoked by Forge event commands or the architect agent for `architect/spike-framing`.

## Steps

1. Read in-scope memory under `memoryRoot/architecture/` (and related event Docs). Match templates in `skills/architect/templates/`.
2. Propose updates via YAML frontmatter schemas (role template `doc` + schema_version 1); body is expansion-only; bump `updated` when frontmatter changes; empty fields OK.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Questions, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
