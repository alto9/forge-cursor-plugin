---
name: forge.validate-ticket
description: >-
  On demand; lead Quality Assurance. Combined QA + Security ticket gate
  (open PR/MR). Forge event command.
---

# forge.validate-ticket
## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.** Exception: Security vetoes merge — do not propose vendor merge unless both QA and Security approve.
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list (must include the required PR/MR verdict comment)
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: On demand
Lead: Quality Assurance
HITL:
Mode: approve-before-vendor
Pause when:
    Always — dual approve (merge) or either-domain pass-back is a required orchestrator-visible call
    qa/queue.md, qa/findings.md, or security/findings.md would change
    qa/test-plan.md scope/checks would change for this item
    security/checklist.md or threat-model.md would change
    Vendor actions: PR/MR verdict comment, merge, delete source branch after merge, board status moves
Instructions:
Take one Ready for QA item (from Engineer) with an open PR/MR on board **In Review** (`statusIds.in_review`). Run QA and Security together — no silent OK from either domain.
QA: verify against spec acceptance criteria and test-plan checks (acceptance, exploratory, repro as needed). Call approve or pass back; propose a one-line verdict for the parent PR/MR comment.
Security: review the same PR/MR against checklist + threat-model (secret-scan, harden-config as needed). Call approve or pass back; propose a one-line verdict for the parent PR/MR comment.
Keep qa/findings.md and security/findings.md separate — one concern per file; reference the board issue id/URL in both.
**Required PR/MR comment (both outcomes):** Parent composes and Applies **one** combined comment via `vendor-pulls-review` before any merge. Shape:
- First line: `Forge validate-ticket: PASS` or `Forge validate-ticket: FAIL`
- Then QA and Security verdict lines (from domain hand-offs)
- On FAIL: short summary + pointers to Open/Blockers findings (no long diary)
**Merge only if both approve.** If either passes back: do not merge; post FAIL comment; board stays `statusIds.in_review`; propose qa/queue.md → Passed back; write Open/Blockers in the relevant findings file(s); remove stale findings that no longer apply.
On dual approve: post PASS comment → propose vendor merge of the PR/MR via `vendor-pulls-merge` (SCM SoT) → **delete the PR/MR source branch** after a successful merge (same human merge approval; not a second HITL) via `vendor-branches-write` / GitLab `should_remove_source_branch` — never delete the default or a protected branch → move board issue to `statusIds.done` via `vendor-issues-write`; then qa/queue.md → Approved; clear related Open findings in both QA and Security findings; remove from backlog.md `# In progress` and clear related in-flight Review state to match SCM; note security checklist gates that passed for this change only if durable. If merge fails, do **not** delete the branch or move the board to Done.
Vendor skills for this event: `vendor-pulls-review` (verdict comment), `vendor-pulls-merge` (dual approve only), `vendor-branches-write` (delete source branch after merge), `vendor-issues-write` (board → done).
Propose qa/test-plan.md updates only when this item needs durable acceptance/regression checks; don’t build a novel per run.
Propose security/threat-model.md updates only when assets/boundaries/threats actually changed; delete obsolete threats/mitigations.
Read engineering/in-flight and product spec as inputs; don’t rewrite product/architecture docs here (escalate design-level issues to Architect/PO events).
No separate merge event — dual approve via this command is the ticket merge gate. Use `/forge.security-review` for non-MR surfaces (config, dependency bump). Use `/forge.regression-pass` for release-level QA.
Docs:
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
<super-repo>/.ai/memory/<submodule>/qa/test-plan.md
<super-repo>/.ai/memory/<submodule>/security/findings.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/security/threat-model.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/engineering/in-flight.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/project/status.md
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
Engineer:
    skills/engineer/respond-to-review/SKILL.md
