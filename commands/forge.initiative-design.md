---
name: forge.initiative-design
description: >-
  On demand; lead Product Owner. Incremental HLD authoring for an initiative —
  roles contribute; no sign-off flip; no board tickets.
---

# forge.initiative-design
## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.** For HLD merges: PO owns feature behavior, Architect owns `spec.md`, Designer owns UX/Figma, Security owns `security.md`.
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: On demand (during HLD; not one session)
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Material edits to initiative feature, spec, design, or security docs
    New open questions that need operator input
Instructions:
Bind to the **active submodule** and one `initiatives/<slug>/` with `status: hld` (or `intake` → treat as HLD).
PO: author/validate `features/initiative.feature` (Gherkin) via write-initiative-feature — one Feature file per initiative.
Architect: deepen `spec.md` (implementation details) via write-initiative-spec.
Designer: when `user_facing: true`, enrich `design.md` + Figma screen refs (pre-build screens); when false, leave design alone / keep designer sign-off `na`.
Security: deepen `security.md` (required for HLD exit).
Append unresolved items to `open-questions.md` with blocking true|false; do not invent answers.
Do **not** set signoffs.* to true — `/forge.initiative-planning` detects completeness and proposes sign-offs / status flip.
Do **not** create board tickets. If one structural/UX unknown blocks progress, recommend `/forge.design-spike`.
Docs:
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/initiative.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/open-questions.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/spec.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/design.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/security.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/features/initiative.feature
Agents:
Product Owner:
    skills/product-owner/write-initiative-feature/SKILL.md
    skills/product-owner/scope-control/SKILL.md
Architect:
    skills/architect/write-initiative-spec/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
    skills/architect/interface-contracts/SKILL.md
Designer:
    skills/designer/initiative-design-check/SKILL.md
    skills/designer/figma-mcp/SKILL.md
    skills/designer/screen-inventory/SKILL.md
# Designer only when user_facing
Security:
    skills/security/initiative-security-spec/SKILL.md
    skills/security/threat-model/SKILL.md
