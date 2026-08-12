---
name: agent-ready-ticket
description: >-
  Gate for /refinement → Ready: full low-level ticket build so an engineer agent
  can implement with no open ambiguity.
---

# agent-ready-ticket

## When to use

During `/refinement` before moving a board item from **Refinement** to **Ready**, and as a preflight in `/implement-ticket`.

## Definition

**Ready** means an AI engineer agent can implement from the board issue (plus linked spec if any) **without asking clarifying questions**.

Input is usually a grooming brief (Intention + Acceptance criteria) already in Refinement. This skill expands that into a full agent brief.

Board/SCM is source of truth: the **issue body** carries the agent brief. Memory `product/specs/<feature>.md` when the work spans multiple concerns; issue + spec must agree (SCM wins until memory refresh).

## Ready checklist (all must pass)

1. **Outcome** — one concrete user/system outcome (maps from Intention).
2. **Scope** — what will change (behaviors, surfaces, APIs, data), bounded.
3. **Acceptance criteria** — testable bullets (Given/When/Then or checkboxes), including edges that change implementation.
4. **Out of scope** — explicit non-goals for this ticket.
5. **Constraints** — stack/architecture/product constraints or pointers to `architecture/*` / brief.
6. **Verification** — how agent/QA proves done (commands, checks, fixtures).
7. **Open questions** — **None**. Unanswered → stay in Refinement or Blocked.
8. **Ambiguity scan** — no TBD/maybe/unresolved alternatives.

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

Preserve grooming Intention by folding it into Outcome (and Notes→Constraints/Scope as needed). Link spec path when a spec exists.

## Spec pairing

- Single-PR tickets: board body alone may pass.
- Multi-area work: create/update `product/specs/<feature>.md`; checklist on union of issue + spec; Open questions empty in both.

## Refinement behavior

- Only **promote Refinement → Ready** when checklist passes.
- Failures stay in Refinement (or Blocked); include pass/fail table in HITL.
- Never say “ready for implementation” unless promoting to Ready.

## Outputs / stop conditions

Checklist per issue id + proposed full issue bodies (and specs). Stop Ready promotion on any fail.
