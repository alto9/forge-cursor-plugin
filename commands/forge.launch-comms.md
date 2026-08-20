---
name: forge.launch-comms
description: >-
  Per release; lead Marketing Manager. Forge event command.
---

# forge.launch-comms
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
- **Decisions needed** — `None`, or listed options (exactly one marked **already in this apply-set** when options exist)
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else (letter, new idea, freeform) reshapes and pauses again. Never Apply a set the user has not seen.

## Event contract

Cadence: Per release
Lead: Marketing Manager
HITL:
Mode: approve-before-write
Pause when:
    Always — launch posts/announcement copy require approval
    social-queue.md or calendar.md would change
    messaging.md one-liner/CTA tweaks for the launch
Instructions:
Turn the release into external comms: announcement + a few social variants aligned to release/notes.md and positioning.
Read release notes, brief, messaging, voice; don’t invent features that didn’t ship.
Propose social-queue.md Ready to post (and Holding if embargoed until cut-release); remove drafts for features that were cut.
Propose calendar.md Upcoming hooks for launch day; clear after launch window.
Coordinate with Release Manager notes.md — marketing does not own the changelog; it owns the public narrative and posts.
Publishing still happens outside the harness after approval (unless a later vendor skill posts for you).
Docs:
<super-repo>/.ai/memory/<submodule>/marketing/social-queue.md
<super-repo>/.ai/memory/<submodule>/marketing/calendar.md
<super-repo>/.ai/memory/<submodule>/marketing/messaging.md
<super-repo>/.ai/memory/<submodule>/marketing/voice.md
<super-repo>/.ai/memory/<submodule>/marketing/positioning.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
Agents:
Marketing Manager:
    skills/marketing-manager/launch-announcement/SKILL.md
    skills/marketing-manager/social-post/SKILL.md
    skills/marketing-manager/messaging/SKILL.md
    skills/marketing-manager/voice/SKILL.md
Release Manager:
    skills/release-manager/write-release-notes/SKILL.md
