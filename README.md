# Forge Cursor Plugin

Solo SDLC harness for a **super-repo of git submodules** (GitHub and GitLab mixed). You are the orchestrator; agents are role specialists. Event commands own Plan Mode and Apply.

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
- Memory lives in the **memory-repo**: the git submodule checked out at `<super-repo>/.ai/memory/` (tracks `main`). Per code submodule (product): `.ai/memory/<submodulePath>/`. Optional product-family **group** docs: `.ai/memory/groups/<groupId>/` (id from `group.json`; not hardcoded).
- Agents **pull `origin/main`** before reading memory and **commit + push `main`** after Apply (no branches or PRs/MRs on the memory-repo).
- Vendor skills are shared capabilities roles may call; they are not listed on Events by default.

## Source of truth

**Board / SCM wins.** Memory is a working projection — not the authority.

- Tickets, PR/MR state, labels, milestones, board columns → GitHub/GitLab
- Code → submodule git history
- Memory (`.ai/memory/...` memory-repo) → shared agent notes, plans, queues (never linked from Ready issue bodies)

If memory disagrees with SCM, update or discard memory drift. When grooming/init writes tickets: write to the board first (plan Accept), then refresh memory to match. Memory backlog/queue files should reference board issue ids/URLs — never invent a parallel ticket numbering system.

**Tickets are actionable only** — never create epic/umbrella issues. **Initiatives** replace epics: HLD lives under `initiatives/<slug>/`; LLD grooming always creates one host milestone per initiative. Outside initiatives, group with a host milestone only when there are **5+** related tickets. After `/forge.refinement`, every Ready ticket has exactly one of `ai-ready` | `human-ready`; `ai-ready` means the agent finishes the ticket start to finish (leftover human executor steps become a separate `human-ready` issue) and also has a tech spec issue comment. User-facing tickets also need a design Ready gate (pass/fail/N/A) with Figma refs inlined in the body when applicable. `/forge.implement-ticket` takes only `ai-ready` (body + tech spec) and requires every sibling on an initiative milestone to be Ready before claim.

## Memory layout

```text
<super-repo>/
  .gitmodules                 # includes path = .ai/memory (memory-repo)
  .ai/memory/                 # memory-repo submodule on main
    groups/<groupId>/         # optional shared family docs + group.json
      group.json              # { id, members: ["<submodulePath>", ...] }
      marketing/ … personas, competitive, design/principles
    <submodulePath>/
      forge.json              # optional group + kind (app|site|library)
      product/  project/  architecture/  engineering/
      qa/  security/  release/  design/   # marketing under group when grouped
  <submodulePath>/            # code submodule
```

Events take a **target**: `--group <id>`, `--submodule` / `--product <path>`, bare name (group id first), or cwd inside a product. **One event, one plan, one target** — a group id is a broader view across members, not one run per repo.
### One-time memory-repo setup

1. Create an empty remote (allow direct push to `main`; no required PR/MR / branch protection that blocks agents).
2. From the super-repo: `git submodule add -b main <url> .ai/memory`
3. Commit `.gitmodules` + gitlink on the super-repo.
4. Run `/forge.init-project` — seeds `memoryRoot` and `commit-memory` pushes to `origin/main`.

**Migration** from an in-tree `.ai/memory/` folder: extract that tree into the new remote, then add the submodule at the same path.

The super-repo gitlink SHA is a **hint only**. Fresh clones and every event run `sync-memory` (always `origin/main`), not a stale `git submodule update` pin.

## Path resolution

Every pausing command starts with [`resolve-paths`](skills/forge/resolve-paths/SKILL.md) → [`resolve-config`](skills/forge/resolve-config/SKILL.md); **`sync-memory` runs on Accept** (before Apply). Ambiguity is a hard stop. Memory-repo sync failure is a hard stop when Apply runs.

Exceptions: `/forge.sync-schedule` skips path/memory entirely. `/forge.implement-ticket` and `/forge.validate-ticket` run `resolve-paths` → `resolve-config` only (skip sync-memory / memory Apply / commit-memory); path ambiguity is still a hard stop, memory-repo sync failure is not.

**Product outputs:** `superRepoRoot`, `submodulePath`, `submoduleRoot`, `memoryRepoRoot`, `memoryRoot`, optional `groupId` / `groupRoot`, `kind`.
**Group outputs:** `superRepoRoot`, `memoryRepoRoot`, `groupId`, `groupRoot`, `members[]`.

- Super-repo: `FORGE_SUPER_REPO`, else walk-up for `.gitmodules` (prefer a root that also has `.ai/memory/`).
- Memory-repo: required `.gitmodules` entry with `path = .ai/memory` (excluded from the code-submodule list).
- Target: `--group <id>` | `--submodule` / `--product <path>` | bare `--target` (group id first, then path) | cwd inside a code path | unique configured product. Fail closed when a bare name matches both a group and a product.
- `memoryRepoRoot = superRepoRoot / .ai/memory`
- `memoryRoot = memoryRepoRoot / submodulePath` (never under submodule code).
- `groupRoot = memoryRepoRoot / groups / <groupId>` when grouped.

Script: `npm run resolve-paths -- [--cwd DIR] [--submodule PATH] [--product PATH] [--group ID] [--target NAME] [--super-repo DIR]`

## Forge config

`<super-repo>/.ai/memory/<submodulePath>/forge.json`

Always required: `version`, `path` (= submodulePath), `host`, and host identity (`github.owner`+`repo` or `gitlab.projectId`).

Optional `kind`: `app` (default) | `site` | `library`. Optional `group`: must match `groups/<id>/group.json`.

Board fields (`projectId` / `boardId` / `statusIds`) required only before board-sync events (not for `kind: site` unless the site has a board). Include:

`backlog` · `refinement` · `ready` · `in_progress` · `in_review` · `done`

(`/forge.backlog-grooming` → `refinement`; `/forge.refinement` → `ready` + `ai-ready` or `human-ready`; `/forge.implement-ticket` claims `in_progress` then PR + CI green → `in_review`; `/forge.validate-ticket` dual approve → auto-merge → `done`.)

Optional `labels.aiReady` / `labels.humanReady` (default `ai-ready` / `human-ready`) — ensured on the host during init/refinement.

Optional `release.gates[]`: ordered event ids for **this** submodule (no harness-wide pipeline). Events stay independently callable; gates define default checklist / pre-cut expectations for `/forge.prepare-release` / `/forge.cut-release` / launch-readiness. Missing/empty gates → no automatic enforcement.

See [`ensure-config`](skills/forge/ensure-config/SKILL.md), [`init-memory`](skills/forge/init-memory/SKILL.md), [`validate-memory`](skills/forge/validate-memory/SKILL.md), [`sync-memory`](skills/forge/sync-memory/SKILL.md), [`commit-memory`](skills/forge/commit-memory/SKILL.md).

**Memory docs:** YAML frontmatter is source of truth (`doc: <role>.*`, `schema_version: 1` or current version, typed core fields); body is expansion-only. `validate-memory` emits readiness **warnings** for weak briefs (empty `product_name` / `problem` / `current_focus`); warnings do not block Apply and no event command gates on brief strength. Schema docs: [docs/memory-schemas.md](docs/memory-schemas.md). Group-owned when `group` is set: `marketing/*`, `product/personas.md`, `product/competitive.md`, `design/principles.md` under `groups/<id>/`.

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
3. `/forge.init-project` — forge.json (+ optional group/kind) + seed memory + first brief/roadmap/backlog/architecture sketch + Figma theme bind (defer unbound only via plan Accept) + initial structure check + `commit-memory`
4. `/forge.roadmap-review` — shape Now/Next/Later
5. **Large ideas (HLD):** `/forge.new-initiative` → `/forge.initiative-design` (incremental) + weekly `/forge.initiative-planning` until sign-offs green (`status: lld`). Optional `/forge.design-spike` when one unknown blocks sign-off. Icebox still holds coarse outcomes; initiatives are separate from Icebox tickets.
6. **LLD:** `/forge.backlog-grooming` — require initiative `status == lld`; split into actionable tickets → board **Refinement** (one host milestone per initiative; Designer triage: likely user-facing → Notes `Design: required at refinement`; stub `features/<ticket-slug>.feature` per ticket)
7. `/forge.plan-refresh` — sequence initiative `board_tickets[]` into `project/plan.md` / milestones once grooming has created them
8. `/forge.refinement` — compile ticket `.feature` into Intention + AC; full Ready product body (`agent-ready-ticket`) → board **Ready** (product contract in issue body for all tickets; **`ai-ready` only** — Architect + Security tech spec comment with `<!-- forge-tech-spec -->` from HLD `spec.md`; `human-ready` body-only is OK; **user-facing** — Designer inlines Figma refs/states/a11y; Ready gate includes design pass/fail/N/A and structure pass/fail/N/A; for user-facing **`ai-ready`**, unbound theme or file-structure gaps fail the gate). When the last sibling goes Ready, mark initiative `status: executing`.
9. `/forge.implement-ticket` — only Ready + `ai-ready`; requires issue body + complete tech spec comment; **all initiative siblings Ready**; claims **In Progress** immediately; waits for CI after the PR/MR exists; PR + CI green → **In Review**; auto-Applies SCM only (no Plan pause, no memory); refuses Refinement / `human-ready` / missing tech spec / partial initiative. Brief readiness is advisory only (`validate-memory` warns on weak briefs; no command gates).
10. `/forge.validate-ticket` — QA + Security gate on In Review; required PASS/FAIL PR/MR comment; dual approve → auto-merge → delete source branch → **Done** (auto-Applies SCM only; no Plan pause, no memory)

**Initiative lifecycle (memory):** `intake → hld → lld → executing → shipped` on `initiatives/<slug>/initiative.md`. HLD package: `features/initiative.feature`, `spec.md`, `design.md`, `security.md`, `open-questions.md`. LLD ticket features under `features/<ticket-slug>.feature`. Project rollup: `product/open-questions.md`. Soft-deprecated: `product/specs/<feature>.md` (legacy validation only; new work uses initiatives).

**Monthly research:** `/forge.insights-review` (formerly `/forge.discovery`) synthesizes insights/personas/brief; `/forge.competitive-scan` goes looking at alternatives and rewrites competitive posture — neither is initiative intake.

**Two-step tickets (LLD):** grooming = product intent from HLD (+ Designer triage for likely user-facing); refinement = product contract in the issue body (Outcome, Scope, AC from ticket feature, Out of scope, Constraints, Verification, Open questions=None) plus exactly one of `ai-ready` | `human-ready`. `ai-ready` means the agent finishes the ticket start to finish; leftover human executor steps become a separate `human-ready` issue. For `ai-ready`, Architect + Security also post a tech spec comment (speckit plan-document format). For user-facing tickets, Designer enriches the body inline with Figma context (no separate design-spec comment) and the Ready gate includes design + structure rows; for user-facing `ai-ready`, structure must pass (bound theme, required Figma pages/variable naming patterns/component categories — values stay per-app). `/forge.implement-ticket` reads body + tech spec comment.

## Execution model

Each event is a **human-callable command** (not a cron/automation). Parent owns the ritual:

1. `resolve-paths` → `resolve-config` (fail closed). Prefer Cursor **Plan Mode** for research and the plan delta (request SwitchMode to `plan` if invoked in Agent without an accepted plan). Skip `sync-memory` until Accept.
2. Spawn listed Agents as **propose-only** subagents with the event brief
3. Merge proposals; Lead wins on ties unless Instructions say otherwise; **board/SCM wins over memory**
4. AskQuestion on forks when needed; present the **plan delta** (CreatePlan when available; else markdown)
5. After **Accept (build):** `sync-memory` first (fail closed if pulled files diverge from the plan) → `validate-memory` → Apply vendor/SCM first → Apply memory → `commit-memory` (push memory-repo `main`) if memory changed. **Adjust** reshapes the plan; **Cancel** Applies nothing.

Subagents never pause with the orchestrator, never Apply, never mutate SCM unless executing parent-accepted Apply steps.

**Cursor Plan Mode** is the review surface for pausing events (memory/vendor deltas). **`/forge.plan-refresh`** is a different thing: it rewrites `project/plan.md` (delivery sequence).

### Automation exceptions

`/forge.implement-ticket` and `/forge.validate-ticket` are **invocation-automated**: still human-triggered slash commands, but no Plan pause inside.

- Bootstrap: `resolve-paths` → `resolve-config` only (skip `sync-memory`)
- No plan delta, no Accept gate
- Auto-Apply vendor/SCM only; skip `validate-memory` and `commit-memory`
- Implement: claim → code → PR → CI wait → board In Review
- Validate: QA + Security verdicts → PASS/FAIL PR comment → on dual approve auto-merge, delete source branch, board Done; on pass-back FAIL comment only (board stays In Review)

Board, PR/MR, and comments are the audit trail for these two commands.

### Event modes

`observe` | `plan` | `auto-apply` (implement-ticket / validate-ticket only)

Whether the plan lists vendor actions is an event fact, not a mode. `/forge.respond-to-review` and `/forge.cut-release` may also list **Proposed submodule commits**.

### Plan shape (every pause)

Same event, parent only. Subagents stay propose-only. Prefer Cursor **Plan Mode**; if unavailable (CLI / Auto / some cloud), print the same delta in markdown. `observe` (`/forge.help`) reports only — no plan, no Apply.

**During Plan:** research, spawn propose-only subagents, AskQuestion on forks, then present the plan. Nothing is written. If invoked in Agent mode with no accepted plan for this event, request SwitchMode to `plan` and stop — do not research-and-Apply in one Agent pass.

**Plan delta** (reviewable — not a full file dump):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / create / remove + the material change only (include high-stakes wording when Accept must mean that copy; do not restate unchanged sections)
- **Proposed vendor actions** — none, or explicit list (tag member/host when group-scoped)
- **Left alone** — in-scope docs/actions intentionally unchanged
- **Movement** — on Weekly / Biweekly / Monthly rituals and `/forge.refinement`: what this run advances, or operator-confirmed stay-put after an idle AskQuestion; when the pipeline is starved, include suggested next from the `forge.help` state→command map (`lld` without tickets → `/forge.backlog-grooming`; empty Refinement → `/forge.refinement`; no initiative → `/forge.new-initiative`; …). Re-examine living docs as of this run; an empty input column is an AskQuestion fork (options from Icebox / Later / board / release notes; stay put always allowed), not a successful empty plan. Do not invent work from fog.
- Event extras when the command defines them (`Refinement queue`, `Ready gate`, …) as tables — not pasted tickets
- **Proposed submodule commits** — only for `/forge.respond-to-review` and `/forge.cut-release` when those events write application git

After the plan exists, only three options:

| Reply | Effect |
| --- | --- |
| **Accept (build)** | Apply exactly this plan. Whole plan, last word. |
| **Conversationally adjust** | Stay in Plan; reshape; show a new whole plan. Dropping a line is an adjust, not a partial Apply. |
| **Cancel (close)** | Apply nothing. End the event. |

Never Apply a plan the user has not accepted as a whole. No `approve subset`. Headless uses the same three options in markdown (accept the whole plan / say what to change / cancel).

**Apply** writes exactly what the accepted plan specified. It does not re-research or expand scope.

## Agents

See [`agents/*.md`](agents/) — Architect, Designer, Engineer, Marketing Manager, Product Owner, Project Manager, Quality Assurance, Security, Release Manager.

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
