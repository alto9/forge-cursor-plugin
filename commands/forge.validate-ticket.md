---
name: forge.validate-ticket
description: >-
  On demand; lead Quality Assurance. Combined QA + Security ticket gate
  (open PR/MR). Auto-applies SCM only — no Plan pause, no memory. Dual approve
  auto-merges.
---

# forge.validate-ticket
## Parent execution model

1. Run skills `resolve-paths` → `resolve-config` (fail closed on path ambiguity). **Skip** `sync-memory`. Memory-repo sync failure is not a stop for this event.
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, submoduleRoot, skills to use, and relevant Instructions. Do **not** pass memoryRoot or docs in scope. Subagents must not write memory, must not pause with the orchestrator, and must not mutate vendor/SCM unless the parent asks them to execute an already-decided Apply step.
3. Merge subagent proposals. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM is the source of truth** — no memory projection. Exception: Security vetoes merge — do not merge unless both QA and Security approve.
4. **Auto-Apply** vendor/SCM actions immediately — no Plan pause, no Accept gate.
5. **No memory Apply** — skip `validate-memory` and `commit-memory`.

## Event contract

Cadence: On demand
Lead: Quality Assurance
Gate:
Mode: auto-apply
Pause when:
    Never — this command auto-Applies all vendor/SCM actions after QA + Security verdicts
Instructions:
Take one board item on **In Review** (`statusIds.in_review`) with an open PR/MR (vendor get). Run QA and Security together — no silent OK from either domain.
QA: verify against the issue body’s acceptance criteria (acceptance, exploratory, repro as needed). Build an ephemeral check list from the issue AC — do not read or write `qa/test-plan.md`. Call approve or pass back; return a one-line verdict for the parent PR/MR comment.
Security: review the same PR/MR (secret-scan, harden-config as needed). Call approve or pass back; return a one-line verdict for the parent PR/MR comment. Do not read or write security memory docs for this event.
**Required PR/MR comment (both outcomes):** Parent composes and Applies **one** combined comment via `vendor-pulls-review` before any merge. Shape:
- First line: `Forge validate-ticket: PASS` or `Forge validate-ticket: FAIL`
- Then QA and Security verdict lines (from domain hand-offs)
- On FAIL: short summary of why (no long diary; SCM comment is the audit trail)
**Merge only if both approve.** If either passes back: do not merge; post FAIL comment; board stays `statusIds.in_review`. Do not write memory.
On dual approve (auto-Apply sequence):
1. Post PASS comment via `vendor-pulls-review`
2. Merge the PR/MR via `vendor-pulls-merge`
3. Delete the PR/MR source branch via `vendor-branches-write` / GitLab `should_remove_source_branch` — never delete the default or a protected branch
4. Move board issue to `statusIds.done` via `vendor-issues-write`
If merge fails, do **not** delete the branch or move the board to Done.
Vendor skills for this event: `vendor-pulls-review` (verdict comment), `vendor-pulls-merge` (dual approve only), `vendor-branches-write` (delete source branch after merge), `vendor-issues-write` (board → done).
No separate merge event — dual approve via this command is the ticket merge gate (auto-merge). Use `/forge.security-review` for non-MR surfaces (config, dependency bump). Use `/forge.regression-pass` for release-level QA. Use `/forge.respond-to-review` when fixing a FAIL pass-back.
Docs:
# None — SCM (issue body, PR/MR, board, verdict comment) is SoT; no memory reads or writes
Agents:
Quality Assurance:
    skills/quality-assurance/build-test-plan/SKILL.md
    skills/quality-assurance/verify-acceptance/SKILL.md
    skills/quality-assurance/exploratory-test/SKILL.md
    skills/quality-assurance/reproduce-bug/SKILL.md
    skills/quality-assurance/qa-pass-back/SKILL.md
    skills/quality-assurance/qa-approve-change/SKILL.md
Security:
    skills/security/security-review/SKILL.md
    skills/security/secret-scan/SKILL.md
    skills/security/harden-config/SKILL.md
    skills/security/security-pass-back/SKILL.md
    skills/security/security-approve-change/SKILL.md
