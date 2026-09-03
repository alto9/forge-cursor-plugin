---
name: work-planning
description: >-
  project-manager procedure: work planning. Propose-only when spawned from event commands; touch project/ docs via templates.
---

# work-planning

## When to use

Invoked by Forge event commands or the project-manager agent for `project-manager/work-planning`.

## Steps

1. Read in-scope memory under `memoryRoot/project/` (and related event Docs). Match templates in `skills/project-manager/templates/`.
2. Propose updates via YAML frontmatter schemas (role template `doc` + schema_version 1); body is expansion-only; bump `updated` when frontmatter changes; empty fields OK.
3. Re-read in-scope docs as of this run; remove stale items; leave files alone only when still true after that judgment (and after any idle AskQuestion the parent must run).
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. When event-spawned: return a plan-delta blob (Intent, Proposed memory edits, Proposed vendor actions, Left alone, Movement). Do **not** Apply, pause with the orchestrator, or mutate SCM. Parent owns idle AskQuestion forks.

## Outputs / stop conditions

Plan-delta blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
