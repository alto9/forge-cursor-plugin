---
name: competitive-scan
description: >-
  product-owner procedure: monthly competitive scan. Go look at alternatives,
  then rewrite product/competitive.md posture. Propose-only when event-spawned.
---

# competitive-scan

## When to use

Invoked by `/forge.competitive-scan` or the product-owner agent for the monthly competitive posture refresh. Sibling to `insights-review` (users/problems/personas). **Not** initiative intake — large ideas use `/forge.new-initiative`.

## Steps

1. Read `memoryRoot/product/competitive.md`, `brief.md`, and `roadmap.md` (and related event Docs). Match template `skills/product-owner/templates/competitive.md`.
2. **Go look** before writing: public competitor product surfaces, pricing pages, changelogs, recent reviews or market signal named in `watch_list` / `alternatives`. Prefer primary sources over memory. This is posture research, not a feature-parity checklist.
3. Propose updates to `competitive.md` in place: rewrite `alternatives[]`, `where_we_win[]`, `where_we_lose[]`, `watch_list[]`, and `implications[]` to what is true now. Remove watch-list entries that no longer matter. Bump `updated` when frontmatter changes.
4. Propose `brief.md` / `roadmap.md` edits only when implications change a real bet; otherwise leave them alone.
5. Current state only — no decision diary. Leave files alone when nothing moved.
6. Reference board issue ids/URLs when implications point at work; never invent parallel ticket numbers. **Board/SCM wins** over memory.
7. When event-spawned: return a plan-delta blob (Intent, Proposed memory edits, Proposed vendor actions, Left alone). Do **not** Apply, pause with the orchestrator, or mutate SCM.

## Outputs / stop conditions

Plan-delta blob for the parent command with proposed competitive posture (and optional brief/roadmap when bets move). Stop if path/config unresolved (parent should have run resolve-paths).
