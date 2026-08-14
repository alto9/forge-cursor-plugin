---
name: forge.sync-schedule
description: >-
  On demand; lead (harness). Optional Google Calendar sync for Forge ritual reminders. Not required by any other event.
---

# forge.sync-schedule
Optional convenience. **Not** part of New project path, release gates, or role schedules. Calendar reminders never auto-start harness commands.

## Parent execution model

1. Run `resolve-paths` → `sync-memory` when possible (for submodule context in event descriptions). Soft-fail OK if uninitialized — still can sync plugin-wide rituals.
2. Do **not** spawn role subagents. Parent runs `skills/forge/sync-schedule-calendar/SKILL.md` directly.
3. If Google Calendar MCP is unavailable: report and stop (observe). No CLI fallback.
4. Merge proposed calendar creates/updates + optional `forge.json` `calendar` prefs into one hand-off.
5. HITL: `approve-before-vendor` before any calendar write; `approve-before-write` if also saving prefs to `forge.json`.
6. On approve: Apply calendar MCP ops first; then Apply `forge.json` prefs if approved; then `commit-memory` if forge.json changed. Skip `validate-memory` template checks for forge.json calendar block (not a role doc) — still keep required forge.json fields intact.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — usually none, or `forge.json` `calendar` prefs only
- **Proposed vendor actions** — calendar create/update/delete list (`Forge: <event-id>`)
- **Decisions needed** — timezone, calendar id, slot times for events without prefs; opt-in for On demand / Per release if requested
- **Left alone** — On demand / Per release / Per milestone / Per major bet (unless opted in); events already in sync

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


## Event contract

Cadence: On demand
Lead: (harness — no role Lead)
HITL:
Mode: approve-before-vendor
Pause when:
    Always before create/update/delete on Google Calendar
    When proposing first-time `forge.json` calendar slots/timezone
Instructions:
Build the reminder set from agents/*.md Schedule sections (unique event ids).
Default include: Weekly, Biweekly, Monthly. Default skip: On demand, Per release, Per milestone, Per major bet.
Propose sensible default slots when forge.json calendar.slots is incomplete; require orchestrator OK on times.
Idempotent upsert by event summary "Forge: <event-id>".
Reminders only — description leads with the human ritual name and a dictionary-style goal (skill catalog); then says the human runs /<event-id>. Calendar does not start the harness.
Docs:
<super-repo>/.ai/memory/<submodulePath>/forge.json
# Optional calendar prefs only; other memory docs out of scope
Agents:
# None — parent runs skills/forge/sync-schedule-calendar/SKILL.md
