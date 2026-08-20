---
name: forge.plan-refresh
description: >-
  Biweekly; lead Project Manager. Forge event command.
---

# forge.plan-refresh
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
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else (letter, new idea, freeform) reshapes and pauses again. Never Apply a set the user has not seen.

## Event contract

Cadence: Biweekly
Lead: Project Manager
HITL:
Mode: approve-before-write
Pause when:
    plan.md rewrite/resequence
    milestones.md moves, slips, or deletes
    Any product doc cut proposed (prefer redirect to PO events)
    Architecture dependency/order changes proposed
Instructions:
Propose rewrite of plan.md to the current execution story (replace stale Sequence/Dependencies/Handoffs; don’t append old plan versions).
Read backlog.md and roadmap.md as inputs; don’t propose product doc edits here unless a delivery constraint forces an explicit cut (prefer PO grooming/roadmap-review).
Propose milestones.md updates to match the plan: move/remove completed or abandoned milestones; use Slipped temporarily, then clear or re-date — don’t stockpile slips.
Architect: read constraints/interfaces/risks; propose plan Dependency/Handoff changes only when sequence is structurally forced; leave architecture docs alone unless plan exposes a new structural risk (then prefer architecture-review).
Docs:
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
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
