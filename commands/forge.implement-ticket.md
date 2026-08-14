---
name: forge.implement-ticket
description: >-
  On demand; lead Engineer. Forge event command.
---

# forge.implement-ticket
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
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


## Event contract

Cadence: On demand
Lead: Engineer
HITL:
Mode: approve-before-vendor
Pause when:
    Approach / scope interpretation before substantial coding (if ambiguous vs spec)
    Opening or updating a PR/MR
    Pushing to remote / requesting review
    in-flight.md would change Active/Approach/Blockers materially
Instructions:
Take **one** board **Ready** item with label **`ai-ready`** (statusIds.ready — not Refinement; not `human-ready`). Before coding: load the issue body (vendor get); run the agent-ready-ticket checklist mentally. The issue body alone is the contract — no memory links required.
If the ticket is `human-ready`: **stop**. Do not implement; hand off that a human must execute.
If the ticket is still in Refinement, missing readiness label, or fails the checklist: **stop**. Do not implement. Hand-off → `/forge.refinement` (or demote Ready → Refinement if it drifted).
If it passes: implement in the active submodule — code/tests are the deliverable. Don’t invent scope beyond the issue body.
Optionally read brief/architecture memory as session context; don’t change product/architecture docs here (escalate conflicts to PO/Architect events).
Propose in-flight.md updates for Active/Approach/Open questions/Blockers/Review state; remove the item from Active when PR is open or work is handed off — no done archive.
When implementation is ready for verification, propose adding it to qa/queue.md Ready for QA (do not self-approve). Next human command: `/forge.validate-mr`.
Use vendor skills for branch/PR/MR; propose vendor actions in the hand-off before push/open/update.
Prefer smallest change that meets acceptance criteria; refactor only when required for the ticket.
Docs:
<super-repo>/.ai/memory/<submodule>/engineering/in-flight.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
Agents:
Engineer:
    skills/engineer/implement-ticket/SKILL.md
    skills/engineer/fix-bug/SKILL.md
    skills/engineer/write-tests/SKILL.md
    skills/engineer/debug/SKILL.md
    skills/engineer/refactor/SKILL.md
    skills/engineer/open-pr/SKILL.md
    skills/engineer/update-branch/SKILL.md
Project Manager:
    skills/project-manager/status-update/SKILL.md
