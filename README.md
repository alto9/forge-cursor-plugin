# Forge Cursor Plugin

Solo SDLC harness for a **super-repo of git submodules** (GitHub and GitLab mixed). You are the orchestrator; agents are role specialists. Event commands own HITL and Apply.

## Install locally

**Forge Studio** (VS Code / Cursor extension, `alto9.forge-studio`) is the installer for teammates. After it is installed, it clones this repo to `~/.cursor/plugins/local/forge-cursor` on startup and fast-forwards that clone when `origin` moves. Command Palette → **Forge: Sync Cursor Plugin** does the same on demand; **Forge: Open Forge Course** serves this repo’s `course/` workshop and opens it in a browser tab. Reload the window when the extension says the files changed.

**Add from folder** (Plugins UI) expects a marketplace manifest — this repo has [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json) listing the single `forge-cursor` plugin.

Dev loop without the extension (symlink this working tree):

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)" ~/.cursor/plugins/local/forge-cursor
```

Then **Developer: Reload Window**. Components load from `.cursor-plugin/plugin.json` + auto-discovered `agents/`, `commands/`, `skills/`, `rules/`, `hooks/`. A symlink that is not a git clone will not be overwritten by the extension; remove or replace it if you want the installer to own that path.

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

Exceptions: `/forge.sync-schedule` skips path/memory entirely. `/forge.implement-ticket` and `/forge.validate-ticket` run `resolve-paths` → `resolve-config` only (skip sync-memory / memory Apply / commit-memory); path ambiguity is still a hard stop, memory-repo sync failure is not.

Outputs: `superRepoRoot`, `submodulePath`, `submoduleRoot`, `memoryRepoRoot`, `memoryRoot`.

- Super-repo: `FORGE_SUPER_REPO`, else walk-up for `.gitmodules` (prefer a root that also has `.ai/memory/`).
- Memory-repo: required `.gitmodules` entry with `path = .ai/memory` (excluded from the code-submodule list).
- Code submodule: `--submodule <path>`, else cwd inside a code gitmodules path, else unique configured code submodule. One invocation binds to that one submodule — repeat the command (new `--submodule` or cwd) to run the same ritual on another configured project.
- `memoryRepoRoot = superRepoRoot / .ai/memory`
- `memoryRoot = memoryRepoRoot / submodulePath` (never under submodule code).

Script: `npm run resolve-paths -- [--cwd DIR] [--submodule PATH] [--super-repo DIR]`

## Forge config

`<super-repo>/.ai/memory/<submodulePath>/forge.json`

Always required: `version`, `path` (= submodulePath), `host`, and host identity (`github.owner`+`repo` or `gitlab.projectId`).

Board fields (`projectId` / `boardId` / `statusIds`) required only before board-sync events. Include:

`backlog` · `refinement` · `ready` · `in_progress` · `in_review` · `done`

(`/forge.backlog-grooming` → `refinement`; `/forge.refinement` → `ready` + `ai-ready` or `human-ready`; `/forge.implement-ticket` claims `in_progress` then PR + CI green → `in_review`; `/forge.validate-ticket` dual approve → auto-merge → `done`.)

Optional `labels.aiReady` / `labels.humanReady` (default `ai-ready` / `human-ready`) — ensured on the host during init/refinement.

Optional `release.gates[]`: ordered event ids for **this** submodule (no harness-wide pipeline). Events stay independently callable; gates define default checklist / pre-cut expectations for `/forge.prepare-release` / `/forge.cut-release` / launch-readiness. Missing/empty gates → no automatic enforcement.

See [`ensure-config`](skills/forge/ensure-config/SKILL.md), [`init-memory`](skills/forge/init-memory/SKILL.md), [`validate-memory`](skills/forge/validate-memory/SKILL.md), [`sync-memory`](skills/forge/sync-memory/SKILL.md), [`commit-memory`](skills/forge/commit-memory/SKILL.md).

**Product memory (`product/*`):** YAML frontmatter is source of truth (`doc: product.*`, `schema_version: 1`, typed core fields); body is expansion-only. Other roles’ memory docs still use required H2 headings. `validate-memory` emits readiness **warnings** for weak briefs (empty `product` / `problem` / `current_focus`); warnings do not block Apply and no event command gates on brief strength. Schema docs: [docs/memory-schemas.md](docs/memory-schemas.md).

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
8. `/forge.implement-ticket` — only Ready + `ai-ready`; claims **In Progress** immediately; waits for CI after the PR/MR exists; PR + CI green → **In Review**; auto-Applies SCM only (no HITL, no memory); refuses Refinement / `human-ready`. Brief readiness is advisory only (`validate-memory` warns on weak briefs; no command gates).
9. `/forge.validate-ticket` — QA + Security gate on In Review; required PASS/FAIL PR/MR comment; dual approve → auto-merge → delete source branch → **Done** (auto-Applies SCM only; no HITL, no memory)

**Two-step tickets:** grooming = product intent; refinement = full implementation contract in the issue body (Outcome, Scope, AC, Out of scope, Constraints, Verification, Open questions=None) plus exactly one of `ai-ready` | `human-ready`.

## Execution model

Each event is a **human-callable command** (not a cron/automation). Parent owns the ritual:

1. `resolve-paths` → `sync-memory` → `resolve-config` (fail closed)
2. Spawn listed Agents as **propose-only** subagents with the event brief
3. Merge proposals; Lead wins on ties unless Instructions say otherwise; **board/SCM wins over memory**
4. HITL pause (hand-off shape below)
5. On approve: `validate-memory` → Apply vendor/SCM first → Apply memory → `commit-memory` (push memory-repo `main`) if memory changed

Subagents never HITL, never Apply, never mutate SCM unless executing parent-approved Apply steps.

### Automation exceptions

`/forge.implement-ticket` and `/forge.validate-ticket` are **invocation-automated**: still human-triggered slash commands, but zero hand-off inside.

- Bootstrap: `resolve-paths` → `resolve-config` only (skip `sync-memory`)
- No Questions phase, no apply-set, no orchestrator approve
- Auto-Apply vendor/SCM only; skip `validate-memory` and `commit-memory`
- Implement: claim → code → PR → CI wait → board In Review
- Validate: QA + Security verdicts → PASS/FAIL PR comment → on dual approve auto-merge, delete source branch, board Done; on pass-back FAIL comment only (board stays In Review)

Board, PR/MR, and comments are the audit trail for these two commands.

### HITL modes

`observe` | `propose` | `approve-before-write` | `approve-before-vendor` | `auto-apply` (implement-ticket / validate-ticket only)

### Hand-off shape (every pause)

Two phases, same event, parent only. Subagents stay propose-only and never HITL. One conversation, one Apply gate: talk until the apply-set is right; Apply only on approve of a set the user has seen. Skip Phase 1 when there are no forks. `observe` (`/forge.help`) reports only — no Questions gate, no Apply.

**Phase 1 — Questions** (when forks exist). Nothing is written. Each item is one decision; its letters are options to that decision only. Independent forks are separate questions in the same form, not one flat A/B/C list. Exactly one option per question is labeled `(Recommended)` and listed first. Prefer the host structured-question tool (`AskQuestion`) when it is in the session; if missing (Auto, some models, CLI print/headless, cloud), print the same structure in chat. Do not switch to Plan mode to get the picker. After asking, **stop** — do not Apply or mutate SCM until the user answers. Do not put `approve all` inside the picker.

Markdown fallback for Phase 1:

- One heading (or numbered prompt) per question
- Lettered options; `(Recommended)` on the first option
- Footer: Pick one option per question (Recommended is the default if you want it). Name a letter, or describe a different idea. Nothing is written yet.

A letter, Other, or freeform during Questions is a **redirect**: reshape and ask again.

**Phase 2 — Apply-set** (after answers, or when Phase 1 was skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Questions** — `None` (path letters belong in Phase 1 only)
- **Left alone** — in-scope docs/actions intentionally unchanged
- Event extras when the command defines them (`Refinement queue`, `Ready gate`, …)
- **How to reply** — required footer (fixed copy; do not invent a second instruction paragraph)

| Reply | Effect |
| --- | --- |
| **Questions phase** | Pick an option (or Other / freeform). Not an Apply. |
| **approve all** | Apply exactly the memory + vendor list on the **apply-set** screen. Last word. Only valid when Questions is `None`. |
| **approve subset** | Apply only the memory/vendor lines the user names from that apply-set. Still an Apply; still this proposal, just smaller. |
| **reject** | Apply nothing. End the event. |
| **Anything else on the apply-set** | Freeform steer or new idea. **Redirect**: reshape (may re-open Questions), pause again. Never Apply a set the user has not seen. |

**How to reply** footer on the apply-set:

> Reply **approve all**, **approve subset** (name the lines), or **reject**. Say what to change to reshape and pause again. Nothing is written until you approve.

## Agents

See [`agents/*.md`](agents/) — Architect, Engineer, Marketing Manager, Product Owner, Project Manager, Quality Assurance, Security, Release Manager.

## Event commands

See [`commands/forge.<event-id>.md`](commands/) — all slash commands use a `forge.` prefix (e.g. `/forge.help`, `/forge.init-project`, `/forge.backlog-grooming`, `/forge.refinement`, `/forge.implement-ticket`, `/forge.respond-to-review`, `/forge.validate-ticket`, …). Full list: [`docs/inventory.json`](docs/inventory.json).

## Skills

- **Forge** — paths, sync/commit memory, config, memory seed/validate, help
- **Role** — procedures under `skills/<role>/…` (unique leaf folder names)
- **Vendor** — MCP-mapped under `skills/vendor/vendor-*` (resolve-config first; prefer MCP over CLI). **Never** open branches/PRs/MRs against the memory-repo.

Collision map: [docs/skill-naming.md](docs/skill-naming.md).

### Optional: calendar meetings

`/forge.sync-schedule` ([`commands/forge.sync-schedule.md`](commands/forge.sync-schedule.md), skill [`sync-schedule-calendar`](skills/forge/sync-schedule-calendar/SKILL.md)) can upsert recurring Google Calendar meetings (`Forge: forge.<event-id>`) from agent Schedule cadences when Calendar MCP is available. Meetings are busy blocks with a Google Meet link, harness-wide (all Forge projects), and not tied to one submodule. Not required by init, gates, or other events; never auto-starts commands; skips path/memory resolution.

## Scripts & tests

```bash
npm test
npm run generate          # from design dump / README inventory helper
npm run validate-memory
npm run resolve-paths
npm run memory-repo-git   # sync | commit --memory-repo-root <path>
npm run course            # local workshop site → http://127.0.0.1:4321/
```

### Local course

[`course/`](course/) is a zero-dependency site for three required workshops: **Agentic SDLC** (who / what / why / when), **Using Forge** (how the rituals run), then **Role playbooks** (events, skills, and common goals per role). Progress is stored in the browser. Role and command contracts in `agents/` and `commands/` remain the source of truth; the site is a teaching path over those files.

From this checkout, `npm run course` serves it at `http://127.0.0.1:4321/`. Forge Studio does the same for the cloned plugin: Command Palette → **Forge: Open Forge Course**.

## Out of scope (this plugin)

- Cron / scheduled auto-start of slash commands (implement and validate are invocation-automated once you run them; they do not start themselves)
- Real MCP auth setup in consumer repos
- Populating a real super-repo’s memory beyond templates + skills
- Actor/role registry (which human/machine owns which Forge role) — future; shared memory-repo is the prerequisite
