---
name: forge.refinement
description: >-
  On demand / as needed; lead Product Owner. Expand Refinement-column tickets into
  self-contained Ready work labeled ai-ready or human-ready. ai-ready requires a
  tech spec comment from Architect + Security.
---

# forge.refinement
**LLD pass.** Sibling to `/forge.backlog-grooming`. Grooming lands Intention + AC in **Refinement**; this event builds full Ready tickets (from ticket feature files when initiative-linked) and promotes to **Ready** with an executor label.

## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.** For tech spec merges: PO owns product boundaries, **Designer owns UX/interaction/Figma refs**, Architect owns structure, Security owns safety.
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist (including tech spec comments for `ai-ready`); then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list (include `post issue comment` with full tech spec preview per **`ai-ready`** issue only)
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **Ready gate** — issue id | pass/fail | failing checklist items | proposed label (`ai-ready` | `human-ready`) | tech spec: pass/fail/N/A | **design: pass/fail/N/A** | missing sections
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: On demand (after grooming; before implement-ticket)
Lead: Product Owner
HITL:
Mode: approve-before-vendor
Pause when:
    Expanding issue bodies to Ready product shape
    Tech spec comment draft ready for review (`ai-ready` only)
    Moving board status Refinement → Ready (or back to Refinement/Blocked)
    Applying ai-ready / human-ready labels
    Memory initiative status → executing when all sibling tickets Ready
    Open product/tech/design decisions that block Ready
Instructions:
Bind to the **active submodule** only. Do not refine other configured projects in this run; the orchestrator invokes the command again per path.
Work the board **Refinement** column (forge.json statusIds.refinement) — pull issue ids from board + backlog.md # Refinement.
For each selected item: expand grooming brief into a full Ready body via skills/product-owner/agent-ready-ticket + requirements-writing + **compile-ticket-feature** when the ticket belongs to an initiative. Issue body must stand alone for product facts — no links to memory paths. Ticket `.feature` scenarios **add to** Intention + AC (do not replace Out of scope / Constraints / Verification).
Classify executor: exactly one of `ai-ready` | `human-ready` (forge.json labels.aiReady / labels.humanReady).

Classify **user-facing** (UI flows, visual states, accessibility, interaction) vs not. For user-facing tickets, spawn Designer with `refinement-design-check` (+ `figma-mcp` / `theme-bind` / `design-structure-check` as needed). Designer proposes **inline** Scope/AC/Verification deltas (Figma file + node refs, states, responsive, a11y) — **no** `<!-- forge-design-spec -->` comment. For non-user-facing tickets, design and structure gates are **N/A**. Prefer HLD `design.md` / Figma refs as input when present.

**If `human-ready`:**
Run product checklist (items 1–9); tech spec is N/A — do not spawn Architect/Security for tech spec writing. PO may still use Architect constraint-mapping to inline product-level constraints into the body. Design enrichment is recommended for user-facing work; do not hard-fail solely because Figma MCP is unavailable or file structure is incomplete when a human executor owns UX — note MCP/structure gaps in Questions. On HITL approve: promote to Ready with `human-ready` only — no tech spec comment.

**If `ai-ready`:**
1. Architect proposes tech spec sections via `write-tech-spec` (template `skills/forge/templates/tech-spec.md`) — **slice from** `initiatives/<slug>/spec.md` when the ticket is initiative-linked — plus constraint-mapping / interface-contracts / change-impact as needed.
2. Security proposes security sections via `security-write-tech-spec` (and threat-model / initiative `security.md` as needed).
3. Parent merges into one comment body starting with `<!-- forge-tech-spec:v1 -->`.
4. Ready gate requires merged tech spec complete (mandatory sections; Constitution Check pass; no open clarifications). **Technical** design gaps → stay Refinement or spawn `/forge.design-spike`. **UX** / **structure** gaps → design/structure gate fail; stay Refinement.
5. On HITL approve: post comment via `vendor-issues-comment` **before or with** column move to Ready; use `vendor-issues-comments-list` to find an existing marker comment (update on GitLab via `update_issue_note`, or post replacement on GitHub — newest marker wins).
6. Reclassify `ai-ready` → `human-ready`: do not block promotion if the tech spec is absent.

Only checklist **pass** (items 1–9 + item 10 pass or N/A + **design pass or N/A** + for user-facing **`ai-ready`**, **structure pass**) → vendor move to statusIds.ready, apply the readiness label (strip the other), + backlog.md # Ready. Failures stay Refinement or Blocked; never promote weak tickets.
**Initiative completing:** when promoting a ticket that is the last sibling still not Ready in `initiative.md` `board_tickets[]`, propose `status: executing` on the initiative after all siblings are Ready. Do not start implement until all initiative tickets are Ready (see implement-ticket gate).
Do not create new `product/specs/<feature>.md` for initiative work (soft-deprecated). Open questions must be empty before Ready.
HITL must include Ready gate table (pass/fail + label + tech spec pass/fail/N/A + **design pass/fail/N/A** + **structure pass/fail/N/A**). Do not claim ready for /forge.implement-ticket unless promoting with `ai-ready` **and** a complete tech spec comment.
Do not run high-level prioritization/Icebox cleanup here — that is backlog-grooming.
Docs:
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/initiative.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/spec.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/security.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/design.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/features/
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/security/threat-model.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/design/themes.md
<super-repo>/.ai/memory/<submodule>/design/structure.md
<super-repo>/.ai/memory/<submodule>/design/screens.md
<super-repo>/.ai/memory/<submodule>/design/components.md
<super-repo>/.ai/memory/<submodule>/design/principles.md
Agents:
Product Owner:
    skills/product-owner/agent-ready-ticket/SKILL.md
    skills/product-owner/requirements-writing/SKILL.md
    skills/product-owner/compile-ticket-feature/SKILL.md
    skills/product-owner/scope-control/SKILL.md
Designer:
    skills/designer/refinement-design-check/SKILL.md
    skills/designer/figma-mcp/SKILL.md
    skills/designer/theme-bind/SKILL.md
    skills/designer/design-structure/SKILL.md
    skills/designer/design-structure-check/SKILL.md
# refinement-design-check only when ticket is user-facing; structure-check required for ai-ready user-facing
Architect:
    skills/architect/write-tech-spec/SKILL.md
    skills/architect/write-initiative-spec/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
    skills/architect/interface-contracts/SKILL.md
    skills/architect/change-impact/SKILL.md
# write-tech-spec only when proposed label is ai-ready; prefer slicing initiatives/<slug>/spec.md
Security:
    skills/security/security-write-tech-spec/SKILL.md
    skills/security/threat-model/SKILL.md
# security-write-tech-spec only when proposed label is ai-ready
Engineer:
    skills/engineer/write-tests/SKILL.md
# Engineer here only to stress-test Verification / testability — no code or branch writes in this event
Vendor:
    skills/vendor/vendor-issues-write/SKILL.md
    skills/vendor/vendor-issues-comment/SKILL.md
    skills/vendor/vendor-issues-comments-list/SKILL.md
    skills/vendor/vendor-issues-get/SKILL.md
