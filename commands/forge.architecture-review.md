---
name: forge.architecture-review
description: >-
  Biweekly; lead Architect. Forge event command.
---

# forge.architecture-review
## Parent execution model

1. Resolve target via `resolve-paths` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure). Prefer Cursor **Plan Mode** for research and the plan delta (request SwitchMode to `plan` if invoked in Agent without an accepted plan for this event). Do **not** write memory or mutate vendor/SCM during Plan. Skip `sync-memory` until Accept — Apply pulls then.
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath (or group members), memoryRepoRoot, memoryRoot / groupRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not pause with the orchestrator, must not mutate vendor/SCM.
3. Merge subagent proposals into one plan delta. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. AskQuestion on forks when needed; then present the **plan delta** via CreatePlan when available, else markdown. See Plan shape below. Nothing is written yet.
5. After **Accept (build):** run `sync-memory` first; if pulled files diverge from the accepted plan, fail closed and return to Plan. Then `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates. **Adjust** reshapes the plan; **Cancel** Applies nothing.

### Plan shape (required)

Cursor **Plan Mode** when available; markdown fallback otherwise (CLI / Auto / cloud). Parent only; subagents propose-only. See README Plan shape. No writes until Accept.

**Plan delta** (reviewable — not a full file dump):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / create / remove + the material change only (include high-stakes wording when Accept must mean that copy)
- **Proposed vendor actions** — none, or explicit list
- **Left alone** — in-scope docs/actions intentionally unchanged
- Event extras when the command defines them (Ready gate, HLD gate, Refinement queue, …) as tables — not pasted tickets

After the plan exists, only three options:

- **Accept (build)** — Apply exactly this plan. Whole plan, last word.
- **Conversationally adjust** — stay in Plan, reshape, show a new whole plan. Dropping a line is an adjust, not a partial Apply.
- **Cancel (close)** — Apply nothing. End the event.

Never Apply a plan the user has not accepted as a whole. Headless: same three options in markdown (accept the whole plan / say what to change / cancel).

## Event contract

Cadence: Biweekly
Lead: Architect
Gate:
Mode: plan
Pause when:
    overview.md / constraints.md / interfaces.md / risks.md would change
    New or superseded ADR in decisions.md
Instructions:
Reconcile architecture memory with code and near-term roadmap/plan — current shape only.
Propose overview.md updates when major components, data flow, or deployment shape drifted; remove obsolete components rather than archiving them in-file.
Propose constraints.md / interfaces.md rewrites to current truth; delete constraints/interfaces that no longer apply; clear finished Contracts in flight.
Propose risks.md updates for structural risks only (not delivery blockers — those stay in project/risks.md); delete resolved structural risks.
Propose decisions.md entries only when a decision actually landed or was superseded; do not narrate deliberation.
Read product roadmap and project plan as inputs; don’t edit product/project docs here (redirect to roadmap-review / plan-refresh).
Docs:
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/architecture/decisions.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
Agents:
Architect:
    skills/architect/system-design/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
    skills/architect/interface-contracts/SKILL.md
    skills/architect/architecture-decision/SKILL.md
    skills/architect/technical-risk/SKILL.md
