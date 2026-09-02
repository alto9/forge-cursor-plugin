---
name: forge.init-project
description: >-
  On demand; lead Product Owner. Forge event command.
---

# forge.init-project
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
Lead: Product Owner
Gate:
Mode: plan
Pause when:
    Always — first brief/roadmap/backlog (and forge.json if incomplete) need orchestrator OK
    Seeding new memory files from templates
    Any vendor project/board bootstrap actions
# List vendor actions in the plan if creating remote issues/labels/board columns/milestones.
Instructions:
If resolve-paths fails because `.ai/memory` is missing from `.gitmodules`: **STOP** — tell the orchestrator to add the memory-repo submodule (`git submodule add -b main <url> .ai/memory`), commit the super-repo, then re-run. Do not invent a memory path or write under a non-submodule folder.
Ask in Plan (AskQuestion): standalone product vs **create group** vs **join group**; `kind` (`app` default | `site` | `library`); if joining, which existing tree donates marketing/personas/competitive/principles. Do **not** invent a group from a path prefix.
**Group-only init** (target is a new group id with no members yet, or creating the family shell): create `groups/<id>/group.json` + seed group-owned docs under `groupRoot`; members still get their own `/forge.init-project` runs.
Launch harness memory for the active **product** from a project idea (greenfield or “start managing this repo”). Bind to that product; remaining members wait for their own `/forge.init-project` unless this plan explicitly inits several members.
When `kind: site`: seed only brief + design/*; board/`statusIds` optional; do not seed marketing/architecture/engineering/QA/security/release. Product-targeted implement/grooming/refinement will stop on site.
When `forge.json.group` is set: seed group-owned docs under `groupRoot` (not under `memoryRoot`); set `members[]` to include this path.
Parent runs ensure-config + init-memory (propose seed of missing template files only; never overwrite non-empty docs).
After Apply, parent runs **commit-memory** so seeds land on memory-repo `origin/main`.
PO: propose first-pass brief.md (schema_version 2 frontmatter: `product_name`, `product_description`, `problem`, `audience`, `goals`, `non_goals`, `success_metrics`, `current_focus` — fields may be empty; empty body OK), and for app/library: roadmap.md (Themes + coarse Now/Next), backlog.md (high-level outcomes in Icebox — **not** Refinement/Ready yet), metrics.md stubs if known. Do not create epic issues; Icebox holds coarse outcomes until grooming splits them into actionable tickets.
Architect: for app/library, propose thin overview.md + constraints.md sketch from the idea; leave decisions.md empty unless something is already locked. Skip for `kind: site`.
PM: for app/library, propose empty-but-valid plan.md / status.md / milestones.md aligned to the coarse Now slice (memory projection; host milestones come later when ≥5 related tickets exist). Skip for `kind: site`.
Designer: seed design/* via init-memory (including `design/structure.md`); run theme-bind + figma-mcp — ask for the app's Figma theme URL for user-facing apps; defer unbound only via explicit plan Accept (“no Figma file yet”) and record `structure_status: fail` / gap `"no theme bound"` in `design/structure.md`. After a successful bind, run `design-structure-check` to seed compliance. Principles live under `groupRoot` when grouped; otherwise under `memoryRoot`.
Do not deep-refine tickets here — next for large ideas: `/forge.new-initiative` → HLD (`/forge.initiative-design`, `/forge.initiative-planning`) → LLD (`/forge.backlog-grooming` → `/forge.refinement`). Icebox still holds coarse outcomes until they become initiatives or legacy groomed tickets.
Ensure forge.json statusIds includes `refinement` when board fields are collected (not required for `kind: site`). Ensure `labels.aiReady` / `labels.humanReady` (defaults `ai-ready` / `human-ready`) and propose creating those host labels under plan Accept if missing.
Other role docs may be seeded empty via init-memory and left alone until their events need them.
Docs:
<super-repo>/.ai/memory/<submodule>/forge.json
<super-repo>/.ai/memory/groups/<groupId>/group.json
<super-repo>/.ai/memory/groups/<groupId>/marketing/*
<super-repo>/.ai/memory/groups/<groupId>/product/personas.md
<super-repo>/.ai/memory/groups/<groupId>/product/competitive.md
<super-repo>/.ai/memory/groups/<groupId>/design/principles.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/metrics.md
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/design/themes.md
<super-repo>/.ai/memory/<submodule>/design/structure.md
<super-repo>/.ai/memory/<submodule>/design/tokens.md
<super-repo>/.ai/memory/<submodule>/design/screens.md
<super-repo>/.ai/memory/<submodule>/design/components.md
<super-repo>/.ai/memory/<submodule>/design/principles.md
Agents:
Product Owner:
    skills/product-owner/problem-framing/SKILL.md
    skills/product-owner/roadmapping/SKILL.md
    skills/product-owner/prioritization/SKILL.md
    skills/product-owner/outcome-definition/SKILL.md
Architect:
    skills/architect/system-design/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
Project Manager:
    skills/project-manager/work-planning/SKILL.md
    skills/project-manager/milestone-tracking/SKILL.md
Designer:
    skills/designer/figma-mcp/SKILL.md
    skills/designer/theme-bind/SKILL.md
    skills/designer/design-structure/SKILL.md
    skills/designer/design-structure-check/SKILL.md
    skills/designer/design-principles/SKILL.md
