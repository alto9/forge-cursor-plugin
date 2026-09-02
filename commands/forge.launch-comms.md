---
name: forge.launch-comms
description: >-
  Per release; lead Marketing Manager. Forge event command.
---

# forge.launch-comms
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
Lead: Marketing Manager
Gate:
Mode: plan
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
# When forge.json.group (or group target): marketing/*, personas, competitive, principles live under
# <super-repo>/.ai/memory/groups/<groupId>/ — write once for the family. Standalone: under <submodule>/.
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/social-queue.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/calendar.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/messaging.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/voice.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/positioning.md
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
