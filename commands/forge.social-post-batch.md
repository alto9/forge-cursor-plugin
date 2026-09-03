---
name: forge.social-post-batch
description: >-
  Weekly; lead Marketing Manager. Forge event command.
---

# forge.social-post-batch
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
- **Movement** — what this run advances, or operator-confirmed stay-put after an idle AskQuestion; when the pipeline is starved, suggested next from the forge.help state→command map
- Event extras when the command defines them (Ready gate, HLD gate, Refinement queue, …) as tables — not pasted tickets

After the plan exists, only three options:

- **Accept (build)** — Apply exactly this plan. Whole plan, last word.
- **Conversationally adjust** — stay in Plan, reshape, show a new whole plan. Dropping a line is an adjust, not a partial Apply.
- **Cancel (close)** — Apply nothing. End the event.

Never Apply a plan the user has not accepted as a whole. Headless: same three options in markdown (accept the whole plan / say what to change / cancel).

## Event contract

Cadence: Weekly
Lead: Marketing Manager
Gate:
Mode: plan
Pause when:
    Always — review Ready to post drafts before they stay in queue
    social-queue.md / calendar.md would change
    positioning.md or messaging.md would change (prefer messaging-refresh unless a post forces a fix)
Instructions:
Produce a small batch of on-brand social posts for this project’s channels (default: enough for the week, not a content farm).
Read positioning, messaging, voice, calendar, brief, and recent release notes / roadmap hooks as inputs. Re-examine the queue as of this run.
**Idle fork:** If Ready to post is empty and there are no roadmap / release hooks, AskQuestion **before** CreatePlan which roadmap Now item or release note to write against this week (or stay put). Do not invent product claims from fog.
Propose social-queue.md Ready to post entries with channel + full post text; move weak drafts to Needs revision or delete; remove items already published or killed (orchestrator confirms published).
Propose calendar.md This period / Upcoming hooks updates only when themes shift; don’t append a post history.
Do not auto-publish to social networks in-harness unless a future vendor skill exists — hand-off is approve drafts, then you post.
Stay consistent with voice.md; no hype that contradicts Non-positioning / Words we avoid.
Docs:
# When forge.json.group (or group target): marketing/*, personas, competitive, principles live under
# <super-repo>/.ai/memory/groups/<groupId>/ — write once for the family. Standalone: under <submodule>/.
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/social-queue.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/calendar.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/voice.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/messaging.md
<super-repo>/.ai/memory/<groupOrSubmodule>/marketing/positioning.md
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
