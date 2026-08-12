---
name: constraint-mapping
description: >-
  architect procedure: constraint mapping. Propose-only when spawned from event commands; touch architecture/ docs via templates.
---

# constraint-mapping

## When to use

Invoked by Forge event commands or the architect agent for `architect/constraint-mapping`.

## Steps

1. Read in-scope memory under `memoryRoot/architecture/` (and related event Docs). Match templates in `skills/architect/templates/`.
2. Propose updates with required H2s only; empty sections OK; no extra H2s.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Decisions needed, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
