---
name: forge.outcomes-retro
description: >-
  Per release; lead Product Owner. Forge event command.
---

# forge.outcomes-retro
## Parent execution model

1. Resolve target via `resolve-paths` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure). Prefer Cursor **Plan Mode** for research and the plan delta (request SwitchMode to `plan` if invoked in Agent without an accepted plan for this event). Do **not** write memory or mutate vendor/SCM during Plan. Skip `sync-memory` until Accept — Apply pulls then.
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath (or group members), memoryRepoRoot, memoryRoot / groupRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not pause with the orchestrator, must not mutate vendor/SCM.
3. Merge subagent proposals into one plan delta. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. AskQuestion on forks when needed; then present the **plan delta** via CreatePlan when available, else markdown. See Plan shape below. Nothing is written yet.
5. After **Accept (build):** run `sync-memory` first; if pulled files diverge from the accepted plan, fail closed and return to Plan. Then `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates. **Adjust** reshapes the plan; **Cancel** Applies nothing.

### Plan shape (required)

Cursor **Plan Mode** when available; markdown fallback otherwise (CLI / Auto / cloud). Parent only; subagents propose-only. See README Plan shape. No writes until Accept.

**Plan delta** (reviewable — not a full file dump):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / create / remove + the material change only (include high-stakes wording when Accept must mean that copy)
- **Proposed vendor actions** — none, or explicit list
- **Left alone** — in-scope docs/actions intentionally unchanged
- Event extras when the command defines them (Ready gate, HLD gate, Refinement queue, …) as tables — not pasted tickets

After the plan exists, only three options:

- **Accept (build)** — Apply exactly this plan. Whole plan, last word.
- **Conversationally adjust** — stay in Plan, reshape, show a new whole plan. Dropping a line is an adjust, not a partial Apply.
- **Cancel (close)** — Apply nothing. End the event.

Never Apply a plan the user has not accepted as a whole. Headless: same three options in markdown (accept the whole plan / say what to change / cancel).

## Event contract

Cadence: Per release
Lead: Product Owner
Gate:
Mode: plan
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
