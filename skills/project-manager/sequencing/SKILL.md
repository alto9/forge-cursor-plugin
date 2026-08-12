---
name: sequencing
description: >-
  project-manager procedure: sequencing. Propose-only when spawned from event commands; touch project/ docs via templates.
---

# sequencing

## When to use

Invoked by Forge event commands or the project-manager agent for `project-manager/sequencing`.

## Steps

1. Read in-scope memory under `memoryRoot/project/` (and related event Docs). Match templates in `skills/project-manager/templates/`.
2. Propose updates with required H2s only; empty sections OK; no extra H2s.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Decisions needed, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
