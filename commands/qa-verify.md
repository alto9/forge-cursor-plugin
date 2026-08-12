---
name: qa-verify
description: >-
  On demand; lead Quality Assurance. Forge event command.
---

# qa-verify

## Parent execution model

1. Run skills `resolve-paths` then `resolve-config` (fail closed on path ambiguity).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
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
    Always — approve (merge) or pass-back is a required orchestrator-visible call
    queue.md or findings.md would change
    test-plan.md scope/checks would change for this item
    Vendor actions: PR/MR comments, merge, board status moves
Instructions:
Take one Ready for QA item (from Engineer). Verify against spec acceptance criteria and test-plan checks.
Call: approve or pass back — no silent “looks fine.”
On approve: propose vendor merge of the PR/MR (SCM SoT); move board issue to the configured done/in_review status per forge.json; then queue.md → Approved; clear related Open findings; refresh engineering/in-flight and memory backlog to match SCM.
On pass-back: do not merge; propose queue.md → Passed back; findings.md Open/Blockers with repro + expected vs actual; optional vendor review comments; remove stale findings.
Propose test-plan.md updates only when this item needs durable acceptance/regression checks; don’t build a novel per run.
Read engineering/in-flight and product spec as inputs; don’t rewrite product/architecture docs here.
No separate merge event — QA approve-change is the merge gate.
Docs:
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
<super-repo>/.ai/memory/<submodule>/qa/test-plan.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/engineering/in-flight.md
<super-repo>/.ai/memory/<submodule>/project/status.md
Agents:
Quality Assurance:
    skills/quality-assurance/build-test-plan/SKILL.md
    skills/quality-assurance/verify-acceptance/SKILL.md
    skills/quality-assurance/exploratory-test/SKILL.md
    skills/quality-assurance/reproduce-bug/SKILL.md
    skills/quality-assurance/qa-pass-back/SKILL.md
    skills/quality-assurance/qa-approve-change/SKILL.md
Engineer:
    skills/engineer/respond-to-review/SKILL.md
