---
name: forge.backlog-grooming
description: >-
  Weekly; lead Product Owner. High-level backlog shaping — Intention + acceptance → board Refinement.
---

# forge.backlog-grooming
High-level design pass. **Does not** produce Ready tickets — that is the sibling event `/forge.refinement`.

## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — `None`, or listed options (exactly one marked **already in this apply-set** when options exist)
- **Left alone** — in-scope docs/actions intentionally unchanged
- **Refinement queue** — issue ids moved/kept in Refinement (candidates for `/forge.refinement`)
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else (letter, new idea, freeform) reshapes and pauses again. Never Apply a set the user has not seen.

## Event contract

Cadence: Weekly
Lead: Product Owner
HITL:
Mode: approve-before-vendor
Pause when:
    Priority / Icebox / kill decisions
    Creating or reshaping issues (Intention + Acceptance criteria)
    Moving items into board Refinement (statusIds.refinement)
    plan.md sequence changes from re-ordering
Instructions:
Bind to the **active submodule** only. Do not groom other configured projects in this run; the orchestrator invokes the command again per path.
Read roadmap.md for focus; propose roadmap edits only if grooming exposes a clear conflict (otherwise leave for roadmap-review).
Shape work at **high level**: Intention + Acceptance criteria via skills/product-owner/groom-ticket. Do not require full Scope/Constraints/Verification/Ready bodies here.
**Tickets are actionable only** — never create epic/parent/umbrella issues. If a theme splits into **5 or more** related tickets, create/reuse a **host milestone** and assign those issues; below 5, leave ungrouped.
Propose vendor issue create/update and set status to **Refinement** (forge.json statusIds.refinement). Mirror under backlog.md # Refinement. Do not apply ai-ready/human-ready here.
Do **not** move items to Ready in this event. Do not say “ready for implementation” — say “ready for refinement” / list the Refinement queue.
Re-rank In progress / Refinement; remove shipped, duplicate, or won't-do (delete or Icebox). Leave existing Ready alone unless roadmap kills it (then demote/Icebox).
Propose plan.md Sequence/Dependencies only when backlog order changes delivery order; otherwise leave plan.md alone.
Coarse init-project outcomes → split/clarify into Refinement briefs or Icebox. Escalate product decisions under Decisions needed.
Suggested next after Apply: `/forge.refinement` on the Refinement queue.
Docs:
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
Agents:
Product Owner:
    skills/product-owner/groom-ticket/SKILL.md
    skills/product-owner/prioritization/SKILL.md
    skills/product-owner/scope-control/SKILL.md
    skills/product-owner/outcome-definition/SKILL.md
Project Manager:
    skills/project-manager/sequencing/SKILL.md
    skills/project-manager/work-planning/SKILL.md
