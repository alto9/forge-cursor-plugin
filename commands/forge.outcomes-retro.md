---
name: forge.outcomes-retro
description: >-
  Per release; lead Product Owner. Forge event command.
---

# forge.outcomes-retro
## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: Per release
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Always — outcome call (moved metric / didn’t / inconclusive) required
    Any proposed memory edit across metrics, experiments, insights, roadmap, milestones, risks
Instructions:
Decision pass on outcomes — not a postmortem archive.
Propose metrics.md Current read from post-release signal; remove metrics you will not track going forward.
Propose experiments.md updates: conclude finished bets; delete Concluded entries once the learning is folded into insights/roadmap (don’t keep an experiment graveyard).
Propose insights.md updates with durable learnings only; remove implications that won’t change near-term action.
Propose roadmap.md / milestones.md / risks.md updates when the outcome changes what’s next; delete risks and milestones that the release closed.
Marketing: harvest proof (what worked / what to stop saying); propose messaging/positioning Proof updates; clear stale social-queue Holding items that the outcome killed; don’t rewrite release notes here (Release Manager owns notes.md).
Docs:
<super-repo>/.ai/memory/<submodule>/product/metrics.md
<super-repo>/.ai/memory/<submodule>/product/experiments.md
<super-repo>/.ai/memory/<submodule>/product/insights.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/project/risks.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/marketing/positioning.md
<super-repo>/.ai/memory/<submodule>/marketing/messaging.md
<super-repo>/.ai/memory/<submodule>/marketing/social-queue.md
Agents:
Product Owner:
    skills/product-owner/outcome-definition/SKILL.md
    skills/product-owner/feedback-synthesis/SKILL.md
    skills/product-owner/decision-hygiene/SKILL.md
Project Manager:
    skills/project-manager/risk-tracking/SKILL.md
    skills/project-manager/milestone-tracking/SKILL.md
Marketing Manager:
    skills/marketing-manager/proof-harvest/SKILL.md
    skills/marketing-manager/messaging/SKILL.md
    skills/marketing-manager/positioning/SKILL.md
