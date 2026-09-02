---
name: help
description: >-
  Orient the orchestrator: harness SoT, agents, event commands, and suggested next steps. Read-only.
---

# help

## When to use

`/forge.help` or when the user asks what this harness is / what to run next.

## Steps

1. **resolve-paths** when possible; if ambiguous, explain `FORGE_SUPER_REPO`, `--group`, and `--submodule` / `--product`. List groups under `.ai/memory/groups/` and code submodule paths. If `.ai/memory` memory-repo submodule is missing, say so and point at README setup.
2. When paths resolve, note that memory is the shared memory-repo on `main` (`sync-memory` / `commit-memory` on Accept); do not pull/write on `/forge.help`.
3. Summarize: board/SCM wins, memory layout (product trees + optional `groups/<id>/`), Plan Mode for pausing events (Accept / adjust / Cancel; no partial Apply), parent owns Apply / subagents propose-only. Note that `/forge.implement-ticket` and `/forge.validate-ticket` are auto-apply (no Plan pause, no memory; validate auto-merges on dual approve). Distinguish **Cursor Plan Mode** from `/forge.plan-refresh` (delivery `plan.md`).
4. List agents (one-liner) from `agents/*.md` and event commands from `commands/forge.*.md` (invoke as `/forge.<id>`; cadence + lead), grouped.
5. Suggest 1–3 next commands from current state **for the active target** (group or product). Missing memory-repo or forge.json → setup + `/forge.init-project`; large idea / no initiative → `/forge.new-initiative`; initiative `status: hld` with open sign-offs → `/forge.initiative-design` or `/forge.initiative-planning`; initiative `status: lld` without board tickets → `/forge.backlog-grooming`; Refinement queue → `/forge.refinement`; Ready + `ai-ready` and initiative siblings Ready → `/forge.implement-ticket`; PR + CI green / In Review → `/forge.validate-ticket`; monthly research → `/forge.insights-review` or `/forge.competitive-scan`; etc.). A group target is one plan across members; a product target is one repo (still reads group docs when `forge.json.group` is set).
6. If a topic/event/agent arg is provided, expand that contract from the matching file.
7. Point at New project path in the plugin README when uninitialized.
8. Mention optional `/forge.sync-schedule` only if the user asks about cadence tracking or calendar — not a required next step.
9. Note `/forge.discovery` is a deprecated alias for `/forge.insights-review`.

## Outputs / stop conditions

Scannable report only. **Never** write memory or call vendor mutations.
