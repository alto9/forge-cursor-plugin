---
name: forge.social-post-batch
description: >-
  Weekly; lead Marketing Manager. Forge event command.
---

# forge.social-post-batch
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

Cadence: Weekly
Lead: Marketing Manager
HITL:
Mode: approve-before-write
Pause when:
    Always — review Ready to post drafts before they stay in queue
    social-queue.md / calendar.md would change
    positioning.md or messaging.md would change (prefer messaging-refresh unless a post forces a fix)
Instructions:
Produce a small batch of on-brand social posts for this project’s channels (default: enough for the week, not a content farm).
Read positioning, messaging, voice, calendar, brief, and recent release notes / roadmap hooks as inputs.
Propose social-queue.md Ready to post entries with channel + full post text; move weak drafts to Needs revision or delete; remove items already published or killed (orchestrator confirms published).
Propose calendar.md This period / Upcoming hooks updates only when themes shift; don’t append a post history.
Do not auto-publish to social networks in-harness unless a future vendor skill exists — hand-off is approve drafts, then you post.
Stay consistent with voice.md; no hype that contradicts Non-positioning / Words we avoid.
Docs:
<super-repo>/.ai/memory/<submodule>/marketing/social-queue.md
<super-repo>/.ai/memory/<submodule>/marketing/calendar.md
<super-repo>/.ai/memory/<submodule>/marketing/voice.md
<super-repo>/.ai/memory/<submodule>/marketing/messaging.md
<super-repo>/.ai/memory/<submodule>/marketing/positioning.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
Agents:
Marketing Manager:
    skills/marketing-manager/social-post/SKILL.md
    skills/marketing-manager/content-calendar/SKILL.md
    skills/marketing-manager/voice/SKILL.md
    skills/marketing-manager/messaging/SKILL.md
    skills/marketing-manager/proof-harvest/SKILL.md
