---
name: help
description: >-
  Orient the orchestrator: harness SoT, agents, event commands, and suggested next steps. Read-only.
---

# help

## When to use

`/forge.help` or when the user asks what this harness is / what to run next.

## Steps

1. **resolve-paths** when possible; if ambiguous, explain `FORGE_SUPER_REPO` and `--submodule`. If `.ai/memory` memory-repo submodule is missing, say so and point at README setup.
2. When paths resolve, note that memory is the shared memory-repo on `main` (`sync-memory` / `commit-memory`); do not pull/write on `/forge.help`.
3. Summarize: board/SCM wins, memory layout, HITL for most events, parent owns Apply / subagents propose-only. HITL is two phases in one conversation: **Questions** first (host AskQuestion when available, else markdown; letters belong to a named question; `(Recommended)` first; nothing written), then the **apply-set** with Questions `None`. **approve all** / **approve subset** Applies that set; **reject** Applies nothing; freeform on either phase reshapes and pauses again — never Apply a set the user has not seen. Note that `/forge.implement-ticket` and `/forge.validate-ticket` are auto-apply (no HITL, no memory; validate auto-merges on dual approve).
4. List agents (one-liner) from `agents/*.md` and event commands from `commands/forge.*.md` (invoke as `/forge.<id>`; cadence + lead), grouped.
5. Suggest 1–3 next commands from current state **for the active submodule** (missing memory-repo or forge.json → setup + `/forge.init-project`; large idea / no initiative → `/forge.new-initiative`; initiative `status: hld` with open sign-offs → `/forge.initiative-design` or `/forge.initiative-planning`; initiative `status: lld` without board tickets → `/forge.backlog-grooming`; Refinement queue → `/forge.refinement`; Ready + `ai-ready` and initiative siblings Ready → `/forge.implement-ticket`; PR + CI green / In Review → `/forge.validate-ticket`; monthly research → `/forge.insights-review`; etc.). If the orchestrator manages several Forge projects, say they must run the same command again for each remaining path.
6. If a topic/event/agent arg is provided, expand that contract from the matching file.
7. Point at New project path in the plugin README when uninitialized.
8. Mention optional `/forge.sync-schedule` only if the user asks about cadence tracking or calendar — not a required next step.
9. Note `/forge.discovery` is a deprecated alias for `/forge.insights-review`.

## Outputs / stop conditions

Scannable report only. **Never** write memory or call vendor mutations.
