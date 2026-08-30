---
name: sync-schedule-calendar
description: >-
  Optionally sync Forge event cadences to Google Calendar as meetings (MCP).
  Not wired into other events; never auto-starts harness commands.
---

# sync-schedule-calendar

## When to use

Orchestrator runs `/forge.sync-schedule` (or asks to sync Forge rituals to Google Calendar).
Skip if Calendar MCP is unavailable — report that and stop (do not invent CLI workarounds).

## Scope (optional, not plumbing)

- **Does:** create/update recurring calendar meetings titled `Forge: forge.<event-id>` so rituals block time and include a Google Meet link. One meeting set for **all** Forge projects — not per submodule.
- **Does not:** run `resolve-paths` / `sync-memory` / `resolve-config`; read or write memory or `forge.json`; auto-run event commands; mutate board/SCM; require calendar for any other Forge flow; invite extra attendees.
- Not listed on role agents or release gates. Safe to ignore forever.

## Inputs

1. Plugin `agents/*.md` → each agent's `Schedule:` lines (`Cadence: event-id`). Commands live in the plugin; no project path needed.
2. Existing Google Calendar events titled `Forge: forge.<event-id>` (slot source of truth on re-runs).
3. HITL for first-run timezone, calendar id, and slot times. Defaults if the orchestrator does not specify:

```
calendarId: primary
durationMinutes: 30
availability: AVAILABILITY_BUSY
addGoogleMeetUrl: true
includeCadences: Weekly, Biweekly, Monthly
```

- `weekday`: `MO`…`SU` (RRULE `BYDAY`)
- `time`: local `HH:MM` in the chosen `timeZone`
- `dayOfMonth`: optional for Monthly (default `1`)
- Biweekly → `RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=…`
- Monthly → `RRULE:FREQ=MONTHLY;BYMONTHDAY=…` (or `BYDAY=1MO` if the slot says so)
- Ignore any per-project `forge.json` `calendar` block — meetings are not project-linked.
- Google Meet requires a Google account with Meet enabled. If Meet creation fails, report the MCP error and stop that write.

## Default include / skip

| Cadence | Default |
|---|---|
| Weekly, Biweekly, Monthly | Include (recurring) |
| On demand | Skip |
| Per release, Per milestone, Per major bet | Skip |

List skipped events under **Left alone**. Orchestrator may opt in to specific skipped ids in HITL (still meetings only — no auto-run).

## Steps

1. Confirm Google Calendar MCP tools are available (`list_calendars`). If not → stop with clear message.
2. Do **not** run `resolve-paths`, `sync-memory`, or `resolve-config`. Do not ask for `--submodule` or `FORGE_SUPER_REPO`. Continue even if the workspace is not a Forge super-repo.
3. Collect unique `event-id` + cadence from plugin `agents/*.md` Schedule sections (and optionally `commands/*.md` cadence lines for completeness). Dedupe by event-id; if cadences conflict, prefer the Lead agent's schedule or ask in Questions.
4. Filter by default include/skip (Weekly / Biweekly / Monthly in; On demand and per-release/milestone/bet out unless HITL opts in).
5. Idempotency: `search_events` (or `list_events`) for summary `Forge: forge.<event-id>`.
   - Missing → propose `create_event` with a default slot (spread weeklies across mornings; biweeklies Tuesday; monthlies day 1). Put defaults in HITL — do not invent times silently on Apply.
   - Exists → keep its time/RRULE; propose `update_event` when any of: description drifted, orchestrator-requested time change, `availability` is still `FREE` / not `BUSY`, or the event has no Google Meet conference data.
6. Event payload:
   - `summary`: `Forge: forge.<event-id>` (keep this exact string — idempotency key)
   - `description`: human goal first (catalog below), then how to run it across all Forge projects. Shape:

     ```
     <Ritual name> — <dictionary-style goal. What this time is for, in plain language.>

     When this meeting starts, run /forge.<event-id> in Cursor for each Forge project you manage. This meeting is not tied to one repo. The calendar does not start the harness.
     ```

     Never add a project or submodule line.
   - Use the catalog verbatim. If an event-id is missing, write one sentence in the same voice from the command’s purpose — never use the slash command as the description.
   - `startTime` / `endTime` from existing event or HITL-approved slot + `durationMinutes`
   - `timeZone`, `recurrenceData` (`RRULE:...`), `availability: AVAILABILITY_BUSY` (explicit busy block)
   - `addGoogleMeetUrl: true` on create; on update set `true` when Meet is missing
   - No extra attendees (organizer only)
   - `calendarId` from HITL or primary
7. HITL: Mode `approve-before-vendor` (calendar writes). Proposed vendor actions = calendar create/update/delete list. Proposed memory edits = none.
8. On approve: Apply calendar ops via MCP only. If Meet creation fails, report the MCP error and stop that write.

## Meeting descriptions

Plain-language goal of the ritual — not the harness steps. Lead with the industry name a human would look up.

| Event id | Ritual name | Goal (use as the first paragraph) |
|---|---|---|
| `forge.backlog-grooming` | Backlog grooming | A regular review of the planned work to clarify each item's intent, drop what no longer matters, and decide what is worth shaping next. This is not the pass that makes tickets ready to build. |
| `forge.feedback-triage` | Feedback triage | Sorting new user and market signal into themes, then promoting, re-ranking, or dropping work so the product stays pointed at real problems. |
| `forge.stakeholder-sync` | Stakeholder sync | A check that the product story and delivery reality still match: what is still true, what changed, and what needs a decision. |
| `forge.delivery-status` | Delivery status | A snapshot of what is in flight, what is blocked, and what comes next, so the plan reflects current truth. |
| `forge.risk-review` | Risk review | A live look at threats, issues, and dependencies that could derail delivery, keeping only what is still active. |
| `forge.social-post-batch` | Social post batch | Drafting a small set of on-brand posts for the coming week so there is something ready to publish. Publishing still happens by hand. |
| `forge.metrics-review` | Metrics review | Reading outcomes against targets and deciding whether to stay the course, adjust, or stop a bet. |
| `forge.roadmap-review` | Roadmap review | Reconciling what you will do now, next, and later with the product brief, the numbers, and actual capacity — including hard cuts. |
| `forge.architecture-review` | Architecture review | Checking that the system's shape, constraints, and interfaces still match how the product is being built. |
| `forge.plan-refresh` | Plan refresh | Rewriting the execution sequence so order, dependencies, and milestones match the work as it stands now. |
| `forge.insights-review` | Insights review | Looking for evidence about users and problems, then updating what you believe is true. This is research, not a feature brainstorm or initiative intake. (Formerly `forge.discovery`.) |
| `forge.competitive-scan` | Competitive scan | Refreshing how alternatives win or lose so the product story stays honest. This is not a feature-parity checklist. |
| `forge.messaging-refresh` | Messaging refresh | Updating the external story — positioning, words, and voice — so it still matches the product and the market. |
| `forge.design-system-audit` | Design system audit | Refreshing the app’s Figma theme binding and the token/screen/component inventory so design memory matches Figma. |
| `forge.dependency-audit` | Dependency audit | Checking third-party packages for known issues and risky upgrades, then recommending what to change. |
| `forge.refinement` | Refinement | Turning a high-level idea into a self-contained ticket someone can actually build, with clear scope and acceptance. |
| `forge.init-project` | Project init | Standing up the first product sketch and working memory for a repo so later rituals have something to work from. |
| `forge.launch-readiness-check` | Launch readiness | A go/no-go call on whether this release is actually ready to ship. |
| `forge.outcomes-retro` | Outcomes retro | Looking back at what the release changed — results, learnings, and what to do next. |
| `forge.milestone-check` | Milestone check | Confirming whether a milestone was met, slipped, or should be dropped, and updating the plan to match. |
| `forge.design-spike` | Design spike | A time-boxed investigation of a major technical bet before you commit to a design. |
| `forge.regression-pass` | Regression pass | Re-checking that existing behavior still works before a release. |
| `forge.security-review` | Security review | Reviewing surfaces outside a single pull request — config, dependencies, threats — for security issues. |
| `forge.security-release-gate` | Security release gate | The security go/no-go for this release. |
| `forge.prepare-release` | Prepare release | Assembling version, notes, and checklist so a cut can happen cleanly. |
| `forge.cut-release` | Cut release | Tagging and publishing the prepared release. |
| `forge.launch-comms` | Launch comms | Preparing the public narrative and posts for a ship. |
| `forge.implement-ticket` | Implement ticket | Building a ticket that is already ready to execute. |
| `forge.respond-to-review` | Respond to review | Addressing review comments on an open change. |
| `forge.validate-ticket` | Validate ticket | The combined quality and security gate before a change is merged. |

Example body for `forge.backlog-grooming`:

```
Backlog grooming — A regular review of the planned work to clarify each item's intent, drop what no longer matters, and decide what is worth shaping next. This is not the pass that makes tickets ready to build.

When this meeting starts, run /forge.backlog-grooming in Cursor for each Forge project you manage. This meeting is not tied to one repo. The calendar does not start the harness.
```

## MCP mapping

```
list_calendars
search_events / list_events
create_event   (recurrenceData, timeZone, availability AVAILABILITY_BUSY, addGoogleMeetUrl true)
update_event   (availability BUSY when still FREE; addGoogleMeetUrl true when Meet missing)
delete_event   (only if orchestrator asks to remove Forge meetings)
```

## Outputs / stop conditions

- Hand-off with create/update/skip tables.
- Stop if Calendar MCP is missing. Do not stop for path, submodule, or memory-repo issues.
- If Meet creation fails (account without Meet, MCP error), report and stop that write.
- Never start a Forge event from a calendar trigger.
