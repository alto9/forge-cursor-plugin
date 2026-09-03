---
name: forge.plan-refresh
description: >-
  Biweekly; lead Project Manager. Forge event command.
---

# forge.plan-refresh
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
Lead: Project Manager
Gate:
Mode: plan
Pause when:
    plan.md rewrite/resequence
    milestones.md moves, slips, or deletes
    Any product doc cut proposed (prefer redirect to PO events)
    Architecture dependency/order changes proposed
Instructions:
Propose rewrite of plan.md to the current execution story (replace stale Sequence/Dependencies/Handoffs; don’t append old plan versions). Re-examine against board + backlog as of this run.
**Idle fork:** If nothing is in flight and Ready/Refinement are empty, AskQuestion **before** CreatePlan pointing at `/forge.backlog-grooming` / Icebox (or stay put). Prefer PO events for product cuts.
Read backlog.md and roadmap.md as inputs; don’t propose product doc edits here unless a delivery constraint forces an explicit cut (prefer PO grooming/roadmap-review).
**Initiative LLD:** When initiatives with `status: lld` have `board_tickets[]`, sequence those tickets in plan.md and align `milestones.md` / host milestone dates with the initiative milestone.
Propose milestones.md updates to match the plan: move/remove completed or abandoned milestones; use Slipped temporarily, then clear or re-date — don’t stockpile slips.
Architect: read constraints/interfaces/risks; propose plan Dependency/Handoff changes only when sequence is structurally forced; leave architecture docs alone unless plan exposes a new structural risk (then prefer architecture-review).
Docs:
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/initiative.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
Agents:
Project Manager:
    skills/project-manager/work-planning/SKILL.md
    skills/project-manager/sequencing/SKILL.md
    skills/project-manager/milestone-tracking/SKILL.md
    skills/project-manager/handoff-coordination/SKILL.md
Architect:
    skills/architect/change-impact/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
