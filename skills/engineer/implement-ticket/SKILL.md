---
name: implement-ticket
description: >-
  Implement one ai-ready board ticket in the submodule. Stop if not Ready,
  not ai-ready, missing/incomplete tech spec comment, or the issue body fails
  the Ready gate. Claim In Progress immediately after the gate; wait for CI
  after the PR/MR exists; move to In Review only when CI has succeeded (or the
  host has no CI). Auto-Apply SCM only — no HITL, no memory.
---

# implement-ticket

## When to use

`/forge.implement-ticket` or Engineer agent when taking Ready + `ai-ready` work.

## Steps

1. Load the board issue body (vendor get). List issue comments via `vendor-issues-comments-list`. Find the **newest** comment containing `<!-- forge-tech-spec`. Parse and validate mandatory tech spec sections (same rules as agent-ready-ticket item 10). The **issue body + tech spec comment** are the contract for `ai-ready` work — do not read or write memory.
2. Gate:
   - Status must be Ready (`statusIds.ready`).
   - Label must be `ai-ready` (or `forge.json` `labels.aiReady`). If `human-ready` (or missing readiness label) → **stop**; report that a human must execute (or send back to `/forge.refinement` to classify).
   - Body must pass `skills/product-owner/agent-ready-ticket` product checklist (items 1–9). If Refinement or checklist fail → **stop**. Hand off to `/forge.refinement`; do not invent scope.
   - Tech spec comment must be present and complete (item 10). If missing or incomplete → **fail closed**; hand off to `/forge.refinement`. Do not invent the tech approach.
   - If the issue body is ambiguous (unclear scope, uncheckable AC, open questions remaining) → **fail closed**; hand off to `/forge.refinement`. Do not pause for Questions.
   - **Initiative sibling gate:** If the issue is assigned to a host milestone that groups an initiative (title/description matching an initiative, or known initiative milestone), list sibling issues on that milestone via vendor. Every sibling must be Ready before claim. If any sibling is still Refinement / In Progress / not Ready → **fail closed**; report which siblings are not Ready. Do not implement a partial initiative slice. (Implement stays SCM-only — do not require memory-repo reads.)
3. **Claim (parent Applies immediately):** After gate pass, parent Applies board → `statusIds.in_progress` via `vendor-issues-write`. Do **not** write memory. If gate failed, do **not** claim.
4. Implement the smallest change that meets Acceptance criteria + Verification from the **issue body**, following technical approach, structure, interfaces, and security requirements from the **tech spec comment**. Do not invent scope beyond body AC; follow the spec for *how*.
5. When ready for verification: open/update the PR/MR (auto-Apply). After the PR/MR exists on the host, **wait for CI** via `vendor-ci-status` on that head SHA. Do **not** treat the event as complete while checks/pipelines are pending or running. If CI fails or is cancelled, fix the smallest change that addresses the failure, push (auto-Apply), and wait again. If the host has no CI for the PR/MR, skip the wait.
6. Only after CI completes successfully (or no CI): Apply board → `statusIds.in_review`. Next command: `/forge.validate-ticket`.
7. When event-spawned: propose code/PR/In Review actions to the parent; parent auto-Applies vendor/SCM. Waiting on CI is parent/Engineer polling — not a HITL pause. Do not write memory.

## Outputs / stop conditions

Code/tests meeting acceptance, PR/MR open, **CI terminal success** (or no CI on the host), and board In Progress → In Review — or a stop hand-off if not Ready + `ai-ready` + complete tech spec. Pending or failed CI is **not** complete; stay In Progress and fix.
