---
name: forge.sync-schedule
description: >-
  On demand; lead (harness). Optional Google Calendar sync for Forge ritual meetings. Not required by any other event.
---

# forge.sync-schedule
Optional convenience. **Not** part of New project path, release gates, or role schedules. Calendar meetings are harness-wide (all Forge projects), never project-linked, and never auto-start harness commands.

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

Cadence: On demand
Lead: (harness — no role Lead)
Gate:
Mode: plan
Pause when:
    Always before create/update/delete on Google Calendar
    When proposing first-time timezone / calendar id / slot times
Instructions:
Skip resolve-paths / sync-memory / resolve-config. Meetings are harness-wide — one set for every Forge project, not one repo.
Build the meeting set from plugin agents/*.md Schedule sections (unique event ids).
Default include: Weekly, Biweekly, Monthly. Default skip: On demand, Per release, Per milestone, Per major bet.
Propose sensible default slots when no matching calendar event exists; require orchestrator OK on times. On re-run, keep existing event times unless the orchestrator asks to change them.
Idempotent upsert by event summary "Forge: forge.<event-id>".
Create/update as busy meetings (AVAILABILITY_BUSY) with addGoogleMeetUrl true; no extra attendees. On re-run, upgrade FREE → BUSY and add Meet when missing.
Meetings only — description leads with the human ritual name and a dictionary-style goal (skill catalog); then says the human runs /<event-id> across all Forge projects. Calendar does not start the harness.
Docs:
# None — no memory or forge.json
Agents:
# None — parent runs skills/forge/sync-schedule-calendar/SKILL.md
