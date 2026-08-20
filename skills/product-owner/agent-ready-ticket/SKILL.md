---
name: agent-ready-ticket
description: >-
  Gate for /forge.refinement → Ready: full low-level ticket build so an engineer
  agent or human can execute with no open ambiguity. Classifies ai-ready vs human-ready.
---

# agent-ready-ticket

## When to use

During `/forge.refinement` before moving a board item from **Refinement** to **Ready**, and as a preflight in `/forge.implement-ticket`. Active submodule only — one project per invocation.

## Definition

**Ready** means the **board issue body alone** carries a complete execution contract — no clarifying questions, and **no links to memory files** (`.ai/memory/…`, `product/specs/…`, `architecture/*`, brief, etc.).

Inline every fact the executor needs (stack constraints, interfaces, verification commands). Memory docs may be updated as a **projection** after the board write; they are not part of the ticket contract.

## Executor class (required)

Exactly one label (from `forge.json` `labels.aiReady` / `labels.humanReady`, defaulting to `ai-ready` / `human-ready`):

| Label | Meaning |
|---|---|
| `ai-ready` | An agent can complete the work inline in the submodule (code, tests, in-repo docs). |
| `human-ready` | A human must act (external config, vendor console, credentials, offline ops, org process). |

Both may sit in the Ready column. `/forge.implement-ticket` accepts **only** `ai-ready`. Labels are mutually exclusive — strip the other when applying.

## Ready checklist (all must pass)

1. **Outcome** — one concrete user/system outcome (maps from Intention).
2. **Scope** — what will change (behaviors, surfaces, APIs, data), bounded.
3. **Acceptance criteria** — testable bullets (Given/When/Then or checkboxes), including edges that change implementation.
4. **Out of scope** — explicit non-goals for this ticket.
5. **Constraints** — stack/architecture/product constraints **inlined** in the body (copy the needed facts; do not point at memory paths).
6. **Verification** — how done is proven (commands, checks, fixtures, or human confirmation steps).
7. **Open questions** — **None**. Unanswered → stay in Refinement or Blocked.
8. **Ambiguity scan** — no TBD/maybe/unresolved alternatives.
9. **Executor class** — AI or human chosen; proposed label matches; human-ready bodies still fully specify what the human must do and how to verify.

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

## Memory projection (optional)

- Single-PR / single-concern tickets: board body alone; no memory spec required.
- Multi-area work: may create/update `product/specs/<feature>.md` in memory as a projection of the board contract. Checklist must pass on the **issue body alone**. Never link the spec (or any memory path) from the issue.

## Refinement behavior

- Only **promote Refinement → Ready** when checklist passes.
- On promote: set `statusIds.ready`, apply exactly one of `ai-ready` | `human-ready`, mirror under backlog.md `# Ready`.
- Failures stay in Refinement (or Blocked); include pass/fail table + proposed label in HITL.
- Never say “ready for implementation” unless promoting to Ready.

## Outputs / stop conditions

Checklist per issue id + proposed full issue bodies (+ optional memory specs) + proposed readiness label. Stop Ready promotion on any fail.
