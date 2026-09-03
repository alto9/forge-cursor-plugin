---
name: forge.implement-ticket
description: >-
  On demand; lead Engineer. Forge event command. Auto-applies SCM only — no Plan pause, no memory.
---

# forge.implement-ticket
## Parent execution model

1. Run skills `resolve-paths` → `resolve-config` (fail closed on path ambiguity). **Skip** `sync-memory`. Memory-repo sync failure is not a stop for this event.
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, submoduleRoot, skills to use, and relevant Instructions. Do **not** pass memoryRoot or docs in scope. Subagents must not write memory, must not pause with the orchestrator, and must not mutate vendor/SCM unless the parent asks them to execute an already-decided Apply step.
3. Merge subagent proposals. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM is the source of truth** — no memory projection.
4. **Auto-Apply** vendor/SCM actions immediately — no Plan pause, no Accept gate.
5. **No memory Apply** — skip `validate-memory` and `commit-memory`.

## Event contract

Cadence: On demand
Lead: Engineer
Gate:
Mode: auto-apply
Pause when:
    Never — this command auto-Applies all vendor/SCM actions
Instructions:
If product scope and `forge.json.kind` is `site`: **STOP** — this project is `kind: site` (no ticket board ritual). Use a group target or an `app`/`library` member.
If group scope: skip `kind: site` members for ticket work unless that member has a board; family narrative still reads them for context.
Take **one** board **Ready** item with label **`ai-ready`** (statusIds.ready — not Refinement; not `human-ready`). Before coding: load the issue body (vendor get) and list comments (`vendor-issues-comments-list`); find the newest `<!-- forge-tech-spec` comment; run the agent-ready-ticket checklist mentally. The **issue body + tech spec comment** are the contract for `ai-ready` work.
If the ticket is `human-ready`: **stop**. Do not implement; report that a human must execute.
If the ticket is still in Refinement, missing readiness label, fails the checklist, or lacks a complete tech spec comment: **stop**. Do not implement. Hand off → `/forge.refinement` (or demote Ready → Refinement if it drifted).
If the issue body is ambiguous vs the checklist (unclear scope, uncheckable AC, open questions remaining): **fail closed** — stop and hand off to `/forge.refinement`. Do not invent scope or open a Plan pause.
**Initiative sibling gate:** If this ticket shares a host milestone with other initiative tickets, every sibling on that milestone must also be Ready (vendor list). If any sibling is not Ready → **fail closed**; do not claim or implement a partial slice. (SCM-only — no memory read.)
**If it passes:** parent Applies claim immediately — board `statusIds.in_progress` via `vendor-issues-write`. Command invocation + gate pass **is** the claim authorization. If the gate fails, do **not** claim. Do **not** write memory.
**Worktree from host main (before any code):** Fetch the **host** default branch from `forge.json` identity (`github.owner`/`github.repo` or GitLab project). Create a **new git worktree** with branch `issue-<n>` starting at that fetched SHA. Do all implement / test / commit work in that worktree; leave the submodule checkout alone. **Fail closed** if the worktree cannot be created from that SHA. Never parent from local `HEAD`, the current checkout branch, `issue-(N-1)`, or fork `origin/main` when that remote is not the host. Stacking on a previous ticket branch is a stop even when the trees match (squash rewrites ancestry). Sequential tickets wait for validate/merge, then a fresh fetch.
Then implement in the worktree — code/tests are the deliverable. Meet Acceptance criteria + Verification from the issue body; follow technical approach, structure, interfaces, and security requirements from the tech spec. Don’t invent scope beyond the issue body.
When implementation is ready for verification: open/update the PR/MR via vendor skills (auto-Apply). After the PR/MR exists, **wait for CI** via `vendor-ci-status` on that head SHA — do **not** treat this event as complete while checks/pipelines are pending or running. If CI fails or is cancelled: fix, push (auto-Apply), and wait again. If the host has no CI for the PR/MR, skip the wait. Waiting on CI is polling, not a Plan pause.
Only after CI completes successfully (or no CI): move board to `statusIds.in_review` via `vendor-issues-write` (auto-Apply). Do not self-approve. Next command: `/forge.validate-ticket`.
Use vendor skills for branch/PR/MR, CI status, comments, and status moves (`vendor-issues-write`, `vendor-issues-get`, `vendor-issues-comments-list`, `vendor-branches-write`, `vendor-pulls-write`, `vendor-ci-status`).
Prefer smallest change that meets acceptance criteria; refactor only when required for the ticket.
Docs:
# None — SCM (issue body, tech spec comment, PR/MR, board) is SoT; no memory reads or writes
Agents:
Engineer:
    skills/engineer/implement-ticket/SKILL.md
    skills/engineer/fix-bug/SKILL.md
    skills/engineer/write-tests/SKILL.md
    skills/engineer/debug/SKILL.md
    skills/engineer/refactor/SKILL.md
    skills/engineer/open-pr/SKILL.md
    skills/engineer/update-branch/SKILL.md
    skills/vendor/vendor-branches-write/SKILL.md
    skills/vendor/vendor-ci-status/SKILL.md
    skills/vendor/vendor-issues-comments-list/SKILL.md
    skills/vendor/vendor-issues-get/SKILL.md
