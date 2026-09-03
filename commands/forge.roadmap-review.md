---
name: forge.roadmap-review
description: >-
  Biweekly; lead Product Owner. Forge event command.
---

# forge.roadmap-review
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

Cadence: Biweekly
Lead: Product Owner
Gate:
Mode: plan
Pause when:
    Any Now/Next/Later/Not planning move or delete
    brief.md, backlog.md, plan.md, or milestones.md would change
Instructions:
Re-examine Now/Next/Later against brief, metrics, and delivery capacity as of this run — a filled roadmap is not “done.”
**Idle fork:** If Now is empty or stale vs the board (nothing In Progress / Ready / Refinement matching Now), AskQuestion **before** CreatePlan which Next/Later/Icebox item to promote or kill; stay put always allowed. Do not invent bets from fog.
Propose roadmap.md updates in place: move items across sections; put hard cuts in Not planning; delete items that are obsolete even as “not planning.”
Propose brief.md edits only if roadmap changes force a goals/non-goals/current-focus rewrite.
Propose backlog.md updates to match roadmap cuts/promotions; remove items that roadmap killed.
Propose plan.md and milestones.md updates so delivery matches the new story; remove milestones that are done or abandoned (Slipped is temporary — clear or convert, don’t hoard).
Read metrics.md; don’t propose metrics edits here unless a target/metric ownership change is explicit.
Architect: read architecture docs; flag Now/Next items that violate constraints or need a design-spike before commit; propose architecture doc edits only when roadmap forces a structural change.
Docs:
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/metrics.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
Agents:
Product Owner:
    skills/product-owner/roadmapping/SKILL.md
    skills/product-owner/prioritization/SKILL.md
    skills/product-owner/scope-control/SKILL.md
Project Manager:
    skills/project-manager/work-planning/SKILL.md
    skills/project-manager/milestone-tracking/SKILL.md
Architect:
    skills/architect/change-impact/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
    skills/architect/technical-risk/SKILL.md
