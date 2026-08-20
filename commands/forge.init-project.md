---
name: forge.init-project
description: >-
  On demand; lead Product Owner. Forge event command.
---

# forge.init-project
## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — `None`, or listed options (exactly one marked **already in this apply-set** when options exist)
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else (letter, new idea, freeform) reshapes and pauses again. Never Apply a set the user has not seen.

## Event contract

Cadence: On demand
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Always — first brief/roadmap/backlog (and forge.json if incomplete) need orchestrator OK
    Seeding new memory files from templates
    Any vendor project/board bootstrap actions
# Escalate to approve-before-vendor if creating remote issues/labels/board columns/milestones.
Instructions:
If resolve-paths fails because `.ai/memory` is missing from `.gitmodules`: **STOP** — tell the orchestrator to add the memory-repo submodule (`git submodule add -b main <url> .ai/memory`), commit the super-repo, then re-run. Do not invent a memory path or write under a non-submodule folder.
Launch harness memory for the active submodule from a project idea (greenfield or “start managing this repo”). Bind to that submodule only; remaining code submodules wait for their own `/forge.init-project` run.
Parent runs ensure-config + init-memory (propose seed of missing template files only; never overwrite non-empty docs).
After Apply, parent runs **commit-memory** so seeds land on memory-repo `origin/main`.
PO: propose first-pass brief.md, roadmap.md (Themes + coarse Now/Next), backlog.md (high-level outcomes in Icebox — **not** Refinement/Ready yet), metrics.md stubs if known. Do not create epic issues; Icebox holds coarse outcomes until grooming splits them into actionable tickets.
Architect: propose thin overview.md + constraints.md sketch from the idea; leave decisions.md empty unless something is already locked.
PM: propose empty-but-valid plan.md / status.md / milestones.md aligned to the coarse Now slice (memory projection; host milestones come later when ≥5 related tickets exist).
Do not deep-refine tickets here — next: `/forge.backlog-grooming` (→ Refinement) then `/forge.refinement` (→ Ready + `ai-ready`/`human-ready`).
Ensure forge.json statusIds includes `refinement` when board fields are collected. Ensure `labels.aiReady` / `labels.humanReady` (defaults `ai-ready` / `human-ready`) and propose creating those host labels under HITL if missing.
Other role docs may be seeded empty via init-memory and left alone until their events need them.
Docs:
<super-repo>/.ai/memory/<submodule>/forge.json
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/metrics.md
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
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
