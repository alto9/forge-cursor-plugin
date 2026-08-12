---
name: sync-schedule-calendar
description: >-
  Optionally sync Forge event cadences to Google Calendar as reminders (MCP).
  Not wired into other events; never auto-starts harness commands.
---

# sync-schedule-calendar

## When to use

Orchestrator runs `/forge.sync-schedule` (or asks to sync Forge rituals to Google Calendar).
Skip if Calendar MCP is unavailable — report that and stop (do not invent CLI workarounds).

## Scope (optional, not plumbing)

- **Does:** create/update recurring calendar reminders titled `Forge: forge.<event-id>` so rituals are hard to forget.
- **Does not:** auto-run event commands, mutate board/SCM, or require calendar for any other Forge flow.
- Not listed on role agents or release gates. Safe to ignore forever.

## Inputs

1. Plugin `agents/*.md` → each agent's `Schedule:` lines (`Cadence: event-id`).
2. Optional prefs in `memoryRoot/forge.json` → `calendar` (create/propose on first run):

```json
"calendar": {
  "calendarId": "primary",
  "timeZone": "America/New_York",
  "durationMinutes": 30,
  "availability": "AVAILABILITY_FREE",
  "includeCadences": ["Weekly", "Biweekly", "Monthly"],
  "skipEventIds": [],
  "slots": {
    "forge.backlog-grooming": { "weekday": "MO", "time": "09:00" }
  }
}
```

- `weekday`: `MO`…`SU` (RRULE `BYDAY`)
- `time`: local `HH:MM` in `timeZone`
- `dayOfMonth`: optional for Monthly (default `1`)
- Biweekly → `RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=…`
- Monthly → `RRULE:FREQ=MONTHLY;BYMONTHDAY=…` (or `BYDAY=1MO` if slot says so)

## Default include / skip

| Cadence | Default |
|---|---|
| Weekly, Biweekly, Monthly | Include (recurring) |
| On demand | Skip |
| Per release, Per milestone, Per major bet | Skip |

List skipped events under **Left alone**. Orchestrator may opt in to specific skipped ids in HITL (still reminders only — no auto-run).

## Steps

1. Confirm Google Calendar MCP tools are available (`list_calendars`). If not → stop with clear message.
2. `resolve-paths` (optional submodule context for description text). `forge.json` / `calendar` prefs are niceties, not required for a dry propose.
3. Collect unique `event-id` + cadence from all `agents/*.md` Schedule sections (and optionally `commands/*.md` cadence lines for completeness). Dedupe by event-id; if cadences conflict, prefer the Lead agent's schedule or ask in Decisions needed.
4. Filter by `includeCadences` / `skipEventIds`.
5. For each included event without a `slots` entry, propose a default slot (spread weeklies across mornings; biweeklies Tuesday; monthlies day 1). Put defaults in HITL for approval — do not invent times silently on Apply. Slot keys and event ids use the slash command id (`forge.<name>`).
6. Idempotency: `search_events` (or `list_events`) for summary `Forge: forge.<event-id>`.
   - Missing → propose `create_event`
   - Exists → propose `update_event` only if time/RRULE/description drift
7. Event payload:
   - `summary`: `Forge: forge.<event-id>`
   - `description`: run `/forge.<event-id>` in Cursor (Forge); reminders only — does not start the harness; optional submodulePath
   - `startTime` / `endTime` from slot + `durationMinutes`
   - `timeZone`, `recurrenceData` (`RRULE:...`), `availability` (prefer FREE so it doesn't block the day)
   - `calendarId` from prefs or primary
8. HITL: Mode `approve-before-vendor` (calendar writes). Proposed vendor actions = calendar create/update/delete list. Optional memory edit = `forge.json` `calendar` prefs / slot map.
9. On approve: Apply calendar ops via MCP; then write approved `calendar` prefs to `forge.json` if proposed.

## MCP mapping

```
list_calendars
search_events / list_events
create_event   (recurrenceData, timeZone, availability)
update_event
delete_event   (only if orchestrator asks to remove Forge reminders)
```

## Outputs / stop conditions

- Hand-off with create/update/skip tables.
- Stop if MCP missing or path/calendar ambiguous.
- Never start a Forge event from a calendar trigger.
