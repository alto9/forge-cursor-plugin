# Forge Cursor Plugin

Solo SDLC harness for a **super-repo of git submodules** (GitHub and GitLab mixed). You are the orchestrator; agents are role specialists. Event commands own HITL and Apply.

## Install locally

**Add from folder** (Plugins UI) expects a marketplace manifest — this repo has [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json) listing the single `forge-cursor` plugin.

Alternatively (dev loop without the marketplace UI):

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)" ~/.cursor/plugins/local/forge-cursor
```

Then **Developer: Reload Window**. Components load from `.cursor-plugin/plugin.json` + auto-discovered `agents/`, `commands/`, `skills/`, `rules/`, `hooks/`.

Executable contracts live in:

| Kind | Path |
|---|---|
| Agents | [`agents/`](agents/) |
| Event commands | [`commands/`](commands/) |
| Skills | [`skills/`](skills/) (see [docs/skill-naming.md](docs/skill-naming.md)) |
| Templates | `skills/<role>/templates/` |
| Always-on rule | [`rules/forge-harness.mdc`](rules/forge-harness.mdc) |
| Inventory | [`docs/inventory.json`](docs/inventory.json) |

Bootstrap from a full design dump at `docs/harness-design.md` (optional): `npm run generate`. After bootstrap, files under `agents/`, `commands/`, and `skills/` are the source of truth.

---

## Harness context

- Workspace is the **super-repo**. Code work happens inside the active project submodule; agent memory does not.
- Memory for each submodule: `<super-repo>/.ai/memory/<submodulePath>/` (mirrors `.gitmodules` path).
- Batch-commit `.ai/` when a session ends — not after every event.
- Vendor skills are shared capabilities roles may call; they are not listed on Events by default.

## Source of truth

**Board / SCM wins.** Memory is a working projection — not the authority.

- Tickets, PR/MR state, labels, board columns → GitHub/GitLab
- Code → submodule git history
- Memory (`.ai/memory/...`) → local notes, plans, queues for agents

If memory disagrees with SCM, update or discard memory drift. When grooming/init writes tickets: write to the board first (HITL), then refresh memory to match. Memory backlog/queue files should reference board issue ids/URLs — never invent a parallel ticket numbering system.

## Memory layout

```text
<super-repo>/
  .gitmodules
  .ai/memory/<submodulePath>/
    forge.json
    product/  project/  architecture/  engineering/
    qa/  security/  release/  marketing/
  <submodulePath>/          # git submodule (code)
```

## Path resolution

Every command starts with [`resolve-paths`](skills/forge/resolve-paths/SKILL.md) then [`resolve-config`](skills/forge/resolve-config/SKILL.md). Ambiguity is a hard stop.

Outputs: `superRepoRoot`, `submodulePath`, `submoduleRoot`, `memoryRoot`.

- Super-repo: `FORGE_SUPER_REPO`, else walk-up for `.gitmodules` (prefer a root that also has `.ai/memory/`).
- Submodule: `--submodule <path>`, else cwd inside a gitmodules path, else unique configured submodule.
- `memoryRoot = superRepoRoot / .ai/memory / submodulePath` (never under submodule code).

Script: `npm run resolve-paths -- [--cwd DIR] [--submodule PATH] [--super-repo DIR]`

## Forge config

`<super-repo>/.ai/memory/<submodulePath>/forge.json`

Always required: `version`, `path` (= submodulePath), `host`, and host identity (`github.owner`+`repo` or `gitlab.projectId`).

Board fields (`projectId` / `boardId` / `statusIds`) required only before board-sync events.

Optional `release.gates[]`: ordered event ids for **this** submodule (no harness-wide pipeline). Events stay independently callable; gates define default checklist / pre-cut expectations for `prepare-release` / `cut-release` / launch-readiness. Missing/empty gates → no automatic enforcement.

See [`ensure-config`](skills/forge/ensure-config/SKILL.md), [`init-memory`](skills/forge/init-memory/SKILL.md), [`validate-memory`](skills/forge/validate-memory/SKILL.md).

## Risk & findings ownership

One concern per file; reference board issue id/URL.

| File | Owns |
|---|---|
| `project/risks.md` | Delivery: schedule, deps, staffing |
| `architecture/risks.md` | Structure: coupling, migrations, tech hazards |
| `qa/findings.md` | Acceptance defects on a change under test |
| `security/findings.md` | Vulns, secrets, authn/z, threat violations |

## New project path

1. `help` — optional orientation (observe-only)
2. `init-project` — forge.json + seed memory + first brief/roadmap/backlog/architecture sketch
3. `roadmap-review` — shape Now/Next/Later
4. `backlog-grooming` — board tickets (SCM SoT); refresh memory; deepen Ready + specs
5. Specs as needed for Ready work (not seeded at init)
6. `plan-refresh` — delivery sequence once Ready work exists

Fine detail = board Ready ticket + spec. Memory mirrors the board.

## Execution model

Each event is a **human-callable command** (not an automation). Parent owns the ritual:

1. `resolve-paths` + `resolve-config` (fail closed)
2. Spawn listed Agents as **propose-only** subagents with the event brief
3. Merge proposals; Lead wins on ties unless Instructions say otherwise; **board/SCM wins over memory**
4. HITL pause (hand-off shape below)
5. On approve: `validate-memory` → Apply vendor/SCM first → Apply memory

Subagents never HITL, never Apply, never mutate SCM unless executing parent-approved Apply steps.

### HITL modes

`observe` | `propose` | `approve-before-write` | `approve-before-vendor`

### Hand-off shape (every pause)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply: approve all | approve subset | reject | redirect.

## Agents

See [`agents/*.md`](agents/) — Architect, Engineer, Marketing Manager, Product Owner, Project Manager, Quality Assurance, Security, Release Manager.

## Event commands

See [`commands/<event-id>.md`](commands/) — including `help`, `init-project`, build loop (`backlog-grooming`, `implement-ticket`, `respond-to-review`, `qa-verify`, …), and release/marketing/security suite. Full list: [`docs/inventory.json`](docs/inventory.json).

## Skills

- **Forge** — paths, config, memory seed/validate, help
- **Role** — procedures under `skills/<role>/…` (unique leaf folder names)
- **Vendor** — MCP-mapped under `skills/vendor/vendor-*` (resolve-config first; prefer MCP over CLI)

Collision map: [docs/skill-naming.md](docs/skill-naming.md).

### Optional: calendar reminders

`/sync-schedule` ([`commands/sync-schedule.md`](commands/sync-schedule.md), skill [`sync-schedule-calendar`](skills/forge/sync-schedule-calendar/SKILL.md)) can upsert recurring Google Calendar reminders (`Forge: <event-id>`) from agent Schedule cadences when Calendar MCP is available. Not required by init, gates, or other events; never auto-starts commands. Prefs live in optional `forge.json` → `calendar`.

## Scripts & tests

```bash
npm test
npm run generate          # from design dump / README inventory helper
npm run validate-memory
npm run resolve-paths
```

## Out of scope (this plugin)

- Automations / cron auto-start of HITL events
- Real MCP auth setup in consumer repos
- Populating a real super-repo’s memory beyond templates + skills
