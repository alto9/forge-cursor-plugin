---
name: agent-ready-ticket
description: >-
  Gate for /forge.refinement → Ready: full low-level ticket build so an engineer
  agent or human can execute with no open ambiguity. Classifies ai-ready vs human-ready.
  ai-ready also requires a tech spec comment.
---

# agent-ready-ticket

## When to use

During `/forge.refinement` before moving a board item from **Refinement** to **Ready**, and as a preflight in `/forge.implement-ticket`. Active submodule only — one project per invocation.

## Definition

**Ready** means the board issue body carries a complete **product** execution contract — no clarifying questions, and **no links to memory files** (`.ai/memory/…`, `product/specs/…`, `architecture/*`, brief, etc.).

| Label | Contract |
|---|---|
| `ai-ready` | Issue body (product) **plus** a tech spec issue comment (`<!-- forge-tech-spec:v1 -->`) from Architect + Security. |
| `human-ready` | Issue body alone — must be self-contained for the human; tech spec comment is **not** required. |

Inline product facts the executor needs in the body. For `ai-ready`, put detailed stack, structure, interfaces, and security requirements in the tech spec comment (template: `skills/forge/templates/tech-spec.md`). Memory docs may be updated as a **projection** after the board write; they are not part of the ticket contract.

## Executor class (required)

Exactly one label (from `forge.json` `labels.aiReady` / `labels.humanReady`, defaulting to `ai-ready` / `human-ready`):

| Label | Meaning |
|---|---|
| `ai-ready` | An agent can complete the work inline in the submodule (code, tests, in-repo docs). |
| `human-ready` | A human must act (external config, vendor console, credentials, offline ops, org process). |

Both may sit in the Ready column. `/forge.implement-ticket` accepts **only** `ai-ready`. Labels are mutually exclusive — strip the other when applying.

## Ready checklist (all must pass; item 10 may be N/A)

1. **Outcome** — one concrete user/system outcome (maps from Intention).
2. **Scope** — what will change (behaviors, surfaces, APIs, data), bounded.
3. **Acceptance criteria** — testable bullets (Given/When/Then or checkboxes), including edges that change implementation.
4. **Out of scope** — explicit non-goals for this ticket.
5. **Constraints** — product/ops rules **inlined** in the body (copy the needed facts; do not point at memory paths). For `ai-ready`, keep body Constraints product-level; technical stack/interfaces belong in the tech spec. For `human-ready`, include enough operational detail in Constraints/Verification since there is no tech spec.
6. **Verification** — how done is proven (commands, checks, fixtures, or human confirmation steps).
7. **Open questions** — **None**. Unanswered → stay in Refinement or Blocked.
8. **Ambiguity scan** — no TBD/maybe/unresolved alternatives.
9. **Executor class** — AI or human chosen; proposed label matches; human-ready bodies still fully specify what the human must do and how to verify.
10. **Tech spec comment (`ai-ready` only)** — if proposed label is `ai-ready`: newest issue comment with `<!-- forge-tech-spec` exists (or is proposed in this Apply-set), mandatory sections complete (Summary, Technical Context, Constitution Check pass, Project Structure, Security Context, Security Requirements, Security Verification), no `[NEEDS CLARIFICATION]`. If `human-ready`: **N/A** (auto-pass).

## Board issue body shape (required for Ready)

```markdown
## Outcome
…

## Scope
…

## Acceptance criteria
- [ ] …
- [ ] …

## Out of scope
…

## Constraints
…

## Verification
…

## Open questions
None
```

Preserve grooming Intention by folding it into Outcome (and Notes→Constraints/Scope as needed). **Do not** put memory file paths or “see `product/specs/…`” links in the issue body.

## Tech spec comment (`ai-ready` only)

- Marker: `<!-- forge-tech-spec:v1 -->` at the top of the comment body.
- Shape: `skills/forge/templates/tech-spec.md` (speckit plan-document format + Security sections; not Spec Kit tooling).
- Parent merges Architect + Security proposals; posts via `vendor-issues-comment` on HITL approve before/with Ready promotion.
- Re-refinement: update existing note (GitLab) or post a replacement (GitHub — newest marker wins).
- Reclassify `ai-ready` → `human-ready`: do not block promotion if the tech spec is absent.

## Memory projection (optional)

- Single-PR / single-concern tickets: board body alone; no memory spec required.
- Multi-area work: may create/update `product/specs/<feature>.md` in memory as a projection of the board contract. Checklist must pass on the **issue body** (and tech spec comment when `ai-ready`). Never link the spec (or any memory path) from the issue.

## Refinement behavior

- Only **promote Refinement → Ready** when checklist items 1–9 pass and item 10 passes or is N/A.
- On promote: set `statusIds.ready`, apply exactly one of `ai-ready` | `human-ready`, mirror under backlog.md `# Ready`. For `ai-ready`, also Apply the tech spec comment.
- Failures stay in Refinement (or Blocked); include pass/fail table + proposed label + tech spec pass/fail/N/A in HITL.
- Never say “ready for implementation” unless promoting to Ready.

## Outputs / stop conditions

Checklist per issue id + proposed full issue bodies (+ optional memory specs) + proposed readiness label + (for `ai-ready`) proposed tech spec comment. Stop Ready promotion on any fail (except item 10 N/A for human-ready).
