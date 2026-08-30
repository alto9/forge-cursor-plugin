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

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **Refinement queue** — issue ids moved/kept in Refinement (candidates for `/forge.refinement`)
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: Weekly
Lead: Product Owner
HITL:
Mode: approve-before-vendor
Pause when:
    Priority / Icebox / kill decisions
    Creating or reshaping issues (Intention + Acceptance criteria)
    Moving items into board Refinement (statusIds.refinement)
    Creating host milestone for an initiative
    plan.md sequence changes from re-ordering
Instructions:
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
