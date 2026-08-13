---
name: forge.validate-mr
description: >-
  On demand; lead Quality Assurance. Combined QA + Security MR gate.
  Forge event command.
---

# forge.validate-mr
## Parent execution model

1. Run skills `resolve-paths` then `resolve-config` (fail closed on path ambiguity).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.** Exception: Security vetoes merge — do not propose vendor merge unless both QA and Security approve.
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM. Never Apply invalid templates.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


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
    Vendor actions: PR/MR comments, merge, board status moves
Instructions:
Take one Ready for QA item (from Engineer) with an open PR/MR. Run QA and Security together — no silent OK from either domain.
QA: verify against spec acceptance criteria and test-plan checks (acceptance, exploratory, repro as needed). Call approve or pass back.
Security: review the same PR/MR against checklist + threat-model (secret-scan, harden-config as needed). Call approve or pass back.
Keep qa/findings.md and security/findings.md separate — one concern per file; reference the board issue id/URL in both.
**Merge only if both approve.** If either passes back: do not merge; propose qa/queue.md → Passed back; write Open/Blockers in the relevant findings file(s); optional vendor review comments; remove stale findings that no longer apply.
On dual approve: propose vendor merge of the PR/MR (SCM SoT); move board issue to the configured done/in_review status per forge.json; then qa/queue.md → Approved; clear related Open findings in both QA and Security findings; refresh engineering/in-flight and memory backlog to match SCM; note security checklist gates that passed for this change only if durable.
Propose qa/test-plan.md updates only when this item needs durable acceptance/regression checks; don’t build a novel per run.
Propose security/threat-model.md updates only when assets/boundaries/threats actually changed; delete obsolete threats/mitigations.
Read engineering/in-flight and product spec as inputs; don’t rewrite product/architecture docs here (escalate design-level issues to Architect/PO events).
No separate merge event — dual approve via this command is the MR merge gate. Use `/forge.security-review` for non-MR surfaces (config, dependency bump). Use `/forge.regression-pass` for release-level QA.
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
