---
name: forge.messaging-refresh
description: >-
  Monthly; lead Marketing Manager. Forge event command.
---

# forge.messaging-refresh
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

Cadence: Monthly
Lead: Marketing Manager
HITL:
Mode: approve-before-write
Pause when:
    positioning.md / messaging.md / voice.md / calendar.md would change
Instructions:
Refresh external story against current brief, competitive notes, and proof — not a slogan brainstorm dump.
Propose positioning.md and messaging.md updates in place; delete pillars/CTAs/proof that are no longer true.
Propose voice.md Example/Anti-pattern updates only when tone drift is real; keep rules short.
Propose calendar.md Themes for the next period; clear stale Upcoming hooks.
Leave social-queue.md alone unless a messaging change kills queued drafts (then remove/revise those items).
Docs:
<super-repo>/.ai/memory/<submodule>/marketing/positioning.md
<super-repo>/.ai/memory/<submodule>/marketing/messaging.md
<super-repo>/.ai/memory/<submodule>/marketing/voice.md
<super-repo>/.ai/memory/<submodule>/marketing/calendar.md
<super-repo>/.ai/memory/<submodule>/marketing/social-queue.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/competitive.md
<super-repo>/.ai/memory/<submodule>/product/insights.md
Agents:
Marketing Manager:
    skills/marketing-manager/positioning/SKILL.md
    skills/marketing-manager/messaging/SKILL.md
    skills/marketing-manager/voice/SKILL.md
    skills/marketing-manager/content-calendar/SKILL.md
    skills/marketing-manager/competitive-angle/SKILL.md
    skills/marketing-manager/proof-harvest/SKILL.md
Product Owner:
    skills/product-owner/stakeholder-alignment/SKILL.md
