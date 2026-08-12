---
name: help
description: >-
  Orient the orchestrator: harness SoT, agents, event commands, and suggested next steps. Read-only.
---

# help

## When to use

`/help` or when the user asks what this harness is / what to run next.

## Steps

1. **resolve-paths** when possible; if ambiguous, explain `FORGE_SUPER_REPO` and `--submodule`.
2. Summarize: board/SCM wins, memory layout, HITL, parent owns Apply / subagents propose-only.
3. List agents (one-liner) from `agents/*.md` and event commands from `commands/*.md` (cadence + lead), grouped.
4. Suggest 1–3 next commands from current state (missing forge.json → `init-project`; coarse backlog → `backlog-grooming`; Refinement queue → `refinement`; Ready → `implement-ticket`; PR ready → `qa-verify`; etc.).
5. If a topic/event/agent arg is provided, expand that contract from the matching file.
6. Point at New project path in the plugin README when uninitialized.
7. Mention optional `/sync-schedule` only if the user asks about cadence tracking or calendar — not a required next step.

## Outputs / stop conditions

Scannable report only. **Never** write memory or call vendor mutations.
