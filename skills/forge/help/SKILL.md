---
name: help
description: >-
  Orient the orchestrator: harness SoT, agents, event commands, and suggested next steps. Read-only.
---

# help

## When to use

`/forge.help` or when the user asks what this harness is / what to run next.

## Steps

1. **resolve-paths** when possible; if ambiguous, explain `FORGE_SUPER_REPO` and `--submodule`.
2. Summarize: board/SCM wins, memory layout, HITL, parent owns Apply / subagents propose-only.
3. List agents (one-liner) from `agents/*.md` and event commands from `commands/forge.*.md` (invoke as `/forge.<id>`; cadence + lead), grouped.
4. Suggest 1–3 next commands from current state (missing forge.json → `/forge.init-project`; coarse backlog → `/forge.backlog-grooming`; Refinement queue → `/forge.refinement`; Ready + `ai-ready` → `/forge.implement-ticket`; PR ready → `/forge.qa-verify`; etc.).
5. If a topic/event/agent arg is provided, expand that contract from the matching file.
6. Point at New project path in the plugin README when uninitialized.
7. Mention optional `/forge.sync-schedule` only if the user asks about cadence tracking or calendar — not a required next step.

## Outputs / stop conditions

Scannable report only. **Never** write memory or call vendor mutations.
