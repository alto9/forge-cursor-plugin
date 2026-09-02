---
name: forge.stakeholder-sync
description: >-
  Weekly; lead Product Owner. Forge event command.
---

# forge.stakeholder-sync
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

Cadence: Weekly
Lead: Product Owner
Gate:
Mode: plan
Pause when:
    brief.md / roadmap.md / backlog.md would change
    status.md or risks.md would drop or add material items
# Always pause for the “still true / changed” call even if proposed edits are empty.
Instructions:
Align on intent vs delivery; hand-off must lead with “still true / changed.”
Propose brief.md edits only when who/problem/goals/non-goals/current focus actually changed — not for status color commentary.
Propose roadmap.md / backlog.md edits only for decisions that change priority or cuts; remove killed items from Now/Ready rather than striking through.
Propose status.md and risks.md updates to current delivery truth; delete cleared blockers/risks/issues (do not keep resolved history in-file).
Docs:
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/project/risks.md
Agents:
Product Owner:
    skills/product-owner/stakeholder-alignment/SKILL.md
    skills/product-owner/roadmapping/SKILL.md
    skills/product-owner/decision-hygiene/SKILL.md
Project Manager:
    skills/project-manager/status-update/SKILL.md
    skills/project-manager/risk-tracking/SKILL.md
