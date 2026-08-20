---
name: forge.delivery-status
description: >-
  Weekly; lead Project Manager. Forge event command.
---

# forge.delivery-status
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

Cadence: Weekly
Lead: Project Manager
HITL:
Mode: propose
Pause when:
    Material blocker/ask changes
    plan.md would change
# Unchanged run: observe (report only). Routine status refreshes apply only after orchestrator says apply.
Instructions:
Refresh delivery truth; leave files alone if nothing material changed.
Propose status.md updates in place (Summary/In flight/Blockers/Next up/Asks); remove cleared blockers and finished in-flight items.
Read plan.md and backlog.md for reconciliation; propose plan.md edits only if sequence/ownership drifted from reality.
Propose risks.md edits only for blockers that are true risks/dependencies; delete entries that are no longer active.
Docs:
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/risks.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
Agents:
Project Manager:
    skills/project-manager/status-update/SKILL.md
    skills/project-manager/blocker-resolution/SKILL.md
    skills/project-manager/dependency-management/SKILL.md
