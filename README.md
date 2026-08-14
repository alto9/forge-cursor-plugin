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
- Memory lives in the **memory-repo**: the git submodule checked out at `<super-repo>/.ai/memory/` (tracks `main`). Per code submodule: `.ai/memory/<submodulePath>/`.
- Agents **pull `origin/main`** before reading memory and **commit + push `main`** after Apply (no branches or PRs/MRs on the memory-repo).
- Vendor skills are shared capabilities roles may call; they are not listed on Events by default.

## Source of truth

**Board / SCM wins.** Memory is a working projection — not the authority.

- Tickets, PR/MR state, labels, milestones, board columns → GitHub/GitLab
- Code → submodule git history
- Memory (`.ai/memory/...` memory-repo) → shared agent notes, plans, queues (never linked from Ready issue bodies)

If memory disagrees with SCM, update or discard memory drift. When grooming/init writes tickets: write to the board first (HITL), then refresh memory to match. Memory backlog/queue files should reference board issue ids/URLs — never invent a parallel ticket numbering system.

**Tickets are actionable only** — never create epic/umbrella issues. Group with a host milestone only when there are **5+** related tickets. After `/forge.refinement`, every Ready ticket has exactly one of `ai-ready` | `human-ready`; `/forge.implement-ticket` takes only `ai-ready`.

## Memory layout

```text
<super-repo>/
  .gitmodules                 # includes path = .ai/memory (memory-repo)
  .ai/memory/                 # memory-repo submodule on main
    <submodulePath>/
      forge.json
      product/  project/  architecture/  engineering/
      qa/  security/  release/  marketing/
  <submodulePath>/            # code submodule
```

### One-time memory-repo setup

1. Create an empty remote (allow direct push to `main`; no required PR/MR / branch protection that blocks agents).
2. From the super-repo: `git submodule add -b main <url> .ai/memory`
3. Commit `.gitmodules` + gitlink on the super-repo.
4. Run `/forge.init-project` — seeds `memoryRoot` and `commit-memory` pushes to `origin/main`.

**Migration** from an in-tree `.ai/memory/` folder: extract that tree into the new remote, then add the submodule at the same path.

The super-repo gitlink SHA is a **hint only**. Fresh clones and every event run `sync-memory` (always `origin/main`), not a stale `git submodule update` pin.

## Path resolution

Every command starts with [`resolve-paths`](skills/forge/resolve-paths/SKILL.md) → [`sync-memory`](skills/forge/sync-memory/SKILL.md) → [`resolve-config`](skills/forge/resolve-config/SKILL.md). Ambiguity or sync failure is a hard stop.

Outputs: `superRepoRoot`, `submodulePath`, `submoduleRoot`, `memoryRepoRoot`, `memoryRoot`.

- Super-repo: `FORGE_SUPER_REPO`, else walk-up for `.gitmodules` (prefer a root that also has `.ai/memory/`).
- Memory-repo: required `.gitmodules` entry with `path = .ai/memory` (excluded from the code-submodule list).
- Code submodule: `--submodule <path>`, else cwd inside a code gitmodules path, else unique configured code submodule.
- `memoryRepoRoot = superRepoRoot / .ai/memory`
- `memoryRoot = memoryRepoRoot / submodulePath` (never under submodule code).

Script: `npm run resolve-paths -- [--cwd DIR] [--submodule PATH] [--super-repo DIR]`

## Forge config

`<super-repo>/.ai/memory/<submodulePath>/forge.json`

Always required: `version`, `path` (= submodulePath), `host`, and host identity (`github.owner`+`repo` or `gitlab.projectId`).

Board fields (`projectId` / `boardId` / `statusIds`) required only before board-sync events. Include:

`backlog` · `refinement` · `ready` · `in_progress` · `in_review` · `done`

(`/forge.backlog-grooming` → `refinement`; `/forge.refinement` → `ready` + `ai-ready` or `human-ready`.)

Optional `labels.aiReady` / `labels.humanReady` (default `ai-ready` / `human-ready`) — ensured on the host during init/refinement.

Optional `release.gates[]`: ordered event ids for **this** submodule (no harness-wide pipeline). Events stay independently callable; gates define default checklist / pre-cut expectations for `/forge.prepare-release` / `/forge.cut-release` / launch-readiness. Missing/empty gates → no automatic enforcement.

See [`ensure-config`](skills/forge/ensure-config/SKILL.md), [`init-memory`](skills/forge/init-memory/SKILL.md), [`validate-memory`](skills/forge/validate-memory/SKILL.md), [`sync-memory`](skills/forge/sync-memory/SKILL.md), [`commit-memory`](skills/forge/commit-memory/SKILL.md).

## Risk & findings ownership

One concern per file; reference board issue id/URL.

| File | Owns |
|---|---|
| `project/risks.md` | Delivery: schedule, deps, staffing |
| `architecture/risks.md` | Structure: coupling, migrations, tech hazards |
| `qa/findings.md` | Acceptance defects on a change under test |
| `security/findings.md` | Vulns, secrets, authn/z, threat violations |

## New project path

1. `/forge.help` — optional orientation (observe-only)
2. Ensure memory-repo submodule at `.ai/memory` (see setup above)
3. `/forge.init-project` — forge.json + seed memory + first brief/roadmap/backlog/architecture sketch + `commit-memory`
4. `/forge.roadmap-review` — shape Now/Next/Later
5. `/forge.backlog-grooming` — high-level Intention + acceptance → board **Refinement**
6. `/forge.refinement` — low-level full ticket build (`agent-ready-ticket`) → board **Ready** (self-contained issue body; optional memory specs as projection only)
7. `/forge.plan-refresh` — delivery sequence once Ready work exists
8. `/forge.implement-ticket` — only Ready + `ai-ready`; refuses Refinement / `human-ready` / weak briefs

**Two-step tickets:** grooming = product intent; refinement = full implementation contract in the issue body (Outcome, Scope, AC, Out of scope, Constraints, Verification, Open questions=None) plus exactly one of `ai-ready` | `human-ready`.

## Execution model

Each event is a **human-callable command** (not an automation). Parent owns the ritual:

1. `resolve-paths` → `sync-memory` → `resolve-config` (fail closed)
2. Spawn listed Agents as **propose-only** subagents with the event brief
3. Merge proposals; Lead wins on ties unless Instructions say otherwise; **board/SCM wins over memory**
4. HITL pause (hand-off shape below)
5. On approve: `validate-memory` → Apply vendor/SCM first → Apply memory → `commit-memory` (push memory-repo `main`) if memory changed

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

See [`commands/forge.<event-id>.md`](commands/) — all slash commands use a `forge.` prefix (e.g. `/forge.help`, `/forge.init-project`, `/forge.backlog-grooming`, `/forge.refinement`, `/forge.implement-ticket`, `/forge.respond-to-review`, `/forge.validate-mr`, …). Full list: [`docs/inventory.json`](docs/inventory.json).

## Skills

- **Forge** — paths, sync/commit memory, config, memory seed/validate, help
- **Role** — procedures under `skills/<role>/…` (unique leaf folder names)
- **Vendor** — MCP-mapped under `skills/vendor/vendor-*` (resolve-config first; prefer MCP over CLI). **Never** open branches/PRs/MRs against the memory-repo.

Collision map: [docs/skill-naming.md](docs/skill-naming.md).

### Optional: calendar reminders

`/forge.sync-schedule` ([`commands/forge.sync-schedule.md`](commands/forge.sync-schedule.md), skill [`sync-schedule-calendar`](skills/forge/sync-schedule-calendar/SKILL.md)) can upsert recurring Google Calendar reminders (`Forge: forge.<event-id>`) from agent Schedule cadences when Calendar MCP is available. Reminders are harness-wide (all Forge projects), not tied to one submodule. Not required by init, gates, or other events; never auto-starts commands; skips path/memory resolution.

## Scripts & tests

```bash
npm test
npm run generate          # from design dump / README inventory helper
npm run validate-memory
npm run resolve-paths
npm run memory-repo-git   # sync | commit --memory-repo-root <path>
```

## Out of scope (this plugin)

- Automations / cron auto-start of HITL events
- Real MCP auth setup in consumer repos
- Populating a real super-repo’s memory beyond templates + skills
- Actor/role registry (which human/machine owns which Forge role) — future; shared memory-repo is the prerequisite
