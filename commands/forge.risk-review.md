---
name: forge.risk-review
description: >-
  Weekly; lead Project Manager. Forge event command.
---

# forge.risk-review
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
- **Movement** — what this run advances, or operator-confirmed stay-put after an idle AskQuestion; when the pipeline is starved, suggested next from the forge.help state→command map
- Event extras when the command defines them (Ready gate, HLD gate, Refinement queue, …) as tables — not pasted tickets

After the plan exists, only three options:

- **Accept (build)** — Apply exactly this plan. Whole plan, last word.
- **Conversationally adjust** — stay in Plan, reshape, show a new whole plan. Dropping a line is an adjust, not a partial Apply.
- **Cancel (close)** — Apply nothing. End the event.

Never Apply a plan the user has not accepted as a whole. Headless: same three options in markdown (accept the whole plan / say what to change / cancel).

## Event contract

Cadence: Weekly
Lead: Project Manager
Gate:
Mode: plan
Pause when:
    Risks/issues/dependencies added or removed
    status.md or plan.md would change from risk posture
Instructions:
Keep risks.md as live posture only — not a history log. Re-examine active Risks/Issues/Dependencies as of this run.
**Idle fork:** If nothing is in flight and Ready/Refinement are empty while risks are empty or all cleared, AskQuestion **before** CreatePlan pointing at `/forge.backlog-grooming` / Icebox (or stay put) — an empty risk page with a starved pipeline is still a movement fork.
Propose risks.md updates: add only active Risks/Issues/Dependencies/Assumptions; delete resolved, expired, or irrelevant rows (no “mitigated on …” archive).
Propose status.md / plan.md edits only when risk posture changes delivery (new blocker, resequence, handoff); otherwise leave them alone.
Docs:
<super-repo>/.ai/memory/<submodule>/project/risks.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/status.md
Agents:
Project Manager:
    skills/project-manager/risk-tracking/SKILL.md
    skills/project-manager/dependency-management/SKILL.md
    skills/project-manager/blocker-resolution/SKILL.md
