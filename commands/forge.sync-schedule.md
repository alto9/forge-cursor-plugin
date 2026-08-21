---
name: forge.sync-schedule
description: >-
  On demand; lead (harness). Optional Google Calendar sync for Forge ritual meetings. Not required by any other event.
---

# forge.sync-schedule
Optional convenience. **Not** part of New project path, release gates, or role schedules. Calendar meetings are harness-wide (all Forge projects), never project-linked, and never auto-start harness commands.

## Parent execution model

1. Do **not** run `resolve-paths`, `sync-memory`, or `resolve-config`. Do not read or write memory, `forge.json`, or a submodule. Path ambiguity is not a stop.
2. Do **not** spawn role subagents. Parent runs `skills/forge/sync-schedule-calendar/SKILL.md` directly.
3. If Google Calendar MCP is unavailable: report and stop (observe). No CLI fallback.
4. Merge proposed calendar creates/updates into one hand-off. Existing `Forge: forge.<event-id>` events are the slot source of truth on re-runs.
5. HITL: `approve-before-vendor` before any calendar write.
6. On approve: Apply calendar MCP ops only. No memory Apply, no `commit-memory`.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; no role subagents.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork (timezone, calendar id, slot times for events not already on the calendar; opt-in for On demand / Per release if requested); lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — none
- **Proposed vendor actions** — calendar create/update/delete list (`Forge: forge.<event-id>`)
- **Questions** — `None`
- **Left alone** — On demand / Per release / Per milestone / Per major bet (unless opted in); events already in sync
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: On demand
Lead: (harness — no role Lead)
HITL:
Mode: approve-before-vendor
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
