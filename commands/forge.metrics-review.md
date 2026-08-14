---
name: forge.metrics-review
description: >-
  Biweekly; lead Product Owner. Forge event command.
---

# forge.metrics-review
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

Cadence: Biweekly
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    stay / adjust / stop decision is non-trivial
    metrics.md, experiments.md, or insights.md would change
# If unchanged read: Mode may downgrade to observe for that run (report only).
Instructions:
Decide stay / adjust / stop against targets; leave files alone if the read is unchanged.
Propose metrics.md Current read (and Targets only if the target itself changed); remove retired metrics from Primary/Supporting.
Propose experiments.md changes: stop dead bets (Active → Concluded, then remove when no longer needed for the next decision); don’t accumulate old experiments.
Propose insights.md edits only when the metrics read changes themes/implications; drop implications that no longer drive action.
Docs:
<super-repo>/.ai/memory/<submodule>/product/metrics.md
<super-repo>/.ai/memory/<submodule>/product/experiments.md
<super-repo>/.ai/memory/<submodule>/product/insights.md
Agents:
Product Owner:
    skills/product-owner/outcome-definition/SKILL.md
    skills/product-owner/feedback-synthesis/SKILL.md
    skills/product-owner/decision-hygiene/SKILL.md
