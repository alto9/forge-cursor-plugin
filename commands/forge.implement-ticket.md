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

**Exception — claim In Progress:** After the Ready + `ai-ready` gate passes, the parent **Applies immediately** (before substantial coding, without waiting for the implementation HITL): board → `statusIds.in_progress` via `vendor-issues-write`, then mirror memory (`engineering/in-flight.md` `# Active`, `product/backlog.md` `# In progress`). Command invocation + gate pass **is** the claim authorization. If the gate fails, do **not** claim.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — `None`, or listed options (exactly one marked **already in this apply-set** when options exist)
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else (letter, new idea, freeform) reshapes and pauses again. Never Apply a set the user has not seen.

## Event contract

Cadence: On demand
Lead: Engineer
HITL:
Mode: approve-before-vendor
Pause when:
    Approach / scope interpretation before substantial coding (if ambiguous vs spec)
    Opening or updating a PR/MR
    Pushing to remote / requesting review
    Moving board In Progress → In Review (`statusIds.in_review`) — only after CI has completed successfully (or the host has no CI)
    in-flight.md would change Active/Approach/Blockers/Review state materially
Instructions:
Take **one** board **Ready** item with label **`ai-ready`** (statusIds.ready — not Refinement; not `human-ready`). Before coding: load the issue body (vendor get); run the agent-ready-ticket checklist mentally. The issue body alone is the contract — no memory links required.
If the ticket is `human-ready`: **stop**. Do not implement; hand off that a human must execute.
If the ticket is still in Refinement, missing readiness label, or fails the checklist: **stop**. Do not implement. Hand-off → `/forge.refinement` (or demote Ready → Refinement if it drifted).
**If it passes:** parent Applies claim immediately — board `statusIds.in_progress` (vendor-issues-write); memory `in-flight.md` `# Active` + `backlog.md` `# In progress`. Do **not** HITL the claim. Then implement in the active submodule — code/tests are the deliverable. Don’t invent scope beyond the issue body.
Optionally read brief/architecture memory as session context; don’t change product/architecture docs here (escalate conflicts to PO/Architect events).
Propose in-flight.md updates for Active/Approach/Open questions/Blockers/Review state during work.
When implementation is ready for verification: propose opening/updating the PR/MR. After the PR/MR exists, **wait for CI** via `vendor-ci-status` on that head SHA — do **not** treat this event as complete while checks/pipelines are pending or running. If CI fails or is cancelled: fix, propose a push (HITL), and wait again. If the host has no CI for the PR/MR, skip the wait. Waiting on CI is polling, not a HITL pause.
Only after CI completes successfully (or no CI): propose board move to `statusIds.in_review`; remove the item from in-flight `# Active` and set `# Review state`; add to qa/queue.md Ready for QA (do not self-approve). Keep backlog.md under `# In progress` until merge (no `# In Review` H2). On orchestrator approve of that hand-off: Apply vendor/SCM first (PR + board `in_review`), then memory. Next human command: `/forge.validate-ticket`.
Use vendor skills for branch/PR/MR, CI status, and status moves (`vendor-issues-write`, `vendor-branches-write`, `vendor-pulls-write`, `vendor-ci-status`); propose vendor actions in the hand-off before push/open/update (except the early In Progress claim).
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
    skills/vendor/vendor-ci-status/SKILL.md
Project Manager:
    skills/project-manager/status-update/SKILL.md
