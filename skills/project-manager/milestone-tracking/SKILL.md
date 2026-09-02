---
name: milestone-tracking
description: >-
  project-manager procedure: milestone tracking. Prefer host milestones as SoT;
  memory project/milestones.md is a projection. Propose-only when event-spawned.
---

# milestone-tracking

## When to use

Invoked by Forge event commands or the project-manager agent for `project-manager/milestone-tracking`.

## Host vs memory

- **Host milestones** (GitHub/GitLab) are the source of truth for grouping tickets.
- **Initiative LLD:** always one host milestone per initiative (see split-initiative / backlog-grooming).
- **Legacy:** Host milestones when a group has **5 or more** related actionable tickets (see groom-ticket). Never invent epic issues.
- Memory `project/milestones.md` projects host state: title, URL/id, related board issue ids/URLs, Active / Upcoming / Slipped. **Board/SCM wins** — refresh memory to match the host.

## Steps

1. Prefer listing host milestones + assigned issues (vendor MCP) when available; then read `memoryRoot/project/` docs.
2. Propose updates via YAML frontmatter schemas (role template `doc` + schema_version 1); body is expansion-only; bump `updated` when frontmatter changes; empty fields OK. Reference host milestone title/URL and board issue ids — never invent parallel ticket numbers.
3. Current state only — remove stale items; leave files alone if unchanged.
4. When host milestone create/close/reopen is needed, list explicit **Proposed vendor actions** (do not invent epic issues).
5. When event-spawned: return a plan-delta blob (Intent, Proposed memory edits, Proposed vendor actions, Left alone). Do **not** Apply, pause with the orchestrator, or mutate SCM.

## Outputs / stop conditions

Plan-delta blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
