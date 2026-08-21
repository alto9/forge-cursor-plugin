---
name: forge.roadmap-review
description: >-
  Biweekly; lead Product Owner. Forge event command.
---

# forge.roadmap-review
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
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: Biweekly
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Any Now/Next/Later/Not planning move or delete
    brief.md, backlog.md, plan.md, or milestones.md would change
Instructions:
Reconcile Now/Next/Later with brief, metrics, and delivery capacity.
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
