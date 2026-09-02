---
name: forge.backlog-grooming
description: >-
  Weekly; lead Product Owner. LLD entry — split HLD-complete initiatives into
  Refinement tickets (Intention + AC). Does not produce Ready tickets.
---

# forge.backlog-grooming
**LLD pass.** Splits initiatives with `status: lld` into actionable board tickets. **Does not** produce Ready tickets — that is `/forge.refinement`.

Also supports legacy Icebox / coarse outcomes when no initiative is in scope (same Intention + AC shape).

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
    Priority / Icebox / kill decisions
    Creating or reshaping issues (Intention + Acceptance criteria)
    Moving items into board Refinement (statusIds.refinement)
    Creating host milestone for an initiative
    plan.md sequence changes from re-ordering
Instructions:
If product scope and `forge.json.kind` is `site`: **STOP** — this project is `kind: site` (no ticket board ritual). Use a group target or an `app`/`library` member.
If group scope: skip `kind: site` members for ticket work unless that member has a board; family narrative still reads them for context.
Bind to the **active submodule** only. Do not groom other configured projects in this run; the orchestrator invokes the command again per path.
**Initiative LLD (preferred):** For each selected `initiatives/<slug>/` with `initiative.md` `status: lld`, run split-initiative:
  - Gate: HLD package present (`features/initiative.feature`, `spec.md`, security; design when user_facing). If still `hld` → stop; hand off to `/forge.initiative-planning`.
  - Split into actionable tickets only (no epics). Intention + AC derived from initiative.feature scenarios via groom-ticket / split-initiative.
  - Always create/reuse **one host milestone per initiative** and assign all its tickets; record `board_milestone` + `board_tickets[]` on initiative.md.
  - Create stub `features/<ticket-slug>.feature` per ticket under the initiative folder.
Spawn **Designer** with `grooming-design-triage` for each groomed item: classify likely user-facing vs not; if user-facing, propose Notes `Design: required at refinement`; unbound theme = warning only.
**Legacy path:** Coarse Icebox / roadmap outcomes without an initiative → same Intention + AC → Refinement; host milestone only when **≥5** related tickets.
**Tickets are actionable only** — never create epic/parent/umbrella issues.
Propose vendor issue create/update and set status to **Refinement**. Mirror under backlog.md # Refinement. Do not apply ai-ready/human-ready here.
Do **not** move items to Ready. Do not say “ready for implementation” — say “ready for refinement”.
Suggested next after Apply: `/forge.plan-refresh` (sequence initiative tickets) then `/forge.refinement`.
Docs:
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/design/themes.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/initiative.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/features/
Agents:
Product Owner:
    skills/product-owner/groom-ticket/SKILL.md
    skills/product-owner/split-initiative/SKILL.md
    skills/product-owner/prioritization/SKILL.md
    skills/product-owner/scope-control/SKILL.md
    skills/product-owner/outcome-definition/SKILL.md
Project Manager:
    skills/project-manager/sequencing/SKILL.md
    skills/project-manager/work-planning/SKILL.md
    skills/project-manager/milestone-tracking/SKILL.md
Designer:
    skills/designer/grooming-design-triage/SKILL.md
