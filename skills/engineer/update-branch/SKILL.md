---
name: update-branch
description: >-
  engineer procedure: update branch. Propose-only when spawned from event commands; touch engineering/ docs via templates.
---

# update-branch

## When to use

Invoked by Forge event commands or the engineer agent for `engineer/update-branch`.

## Steps

1. Read in-scope memory under `memoryRoot/engineering/` (and related event Docs). Match templates in `skills/engineer/templates/`.
2. Propose updates with required H2s only; empty sections OK; no extra H2s.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Questions, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
