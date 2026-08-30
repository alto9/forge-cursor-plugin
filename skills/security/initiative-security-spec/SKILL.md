---
name: initiative-security-spec
description: >-
  Security: author initiatives/<slug>/security.md during HLD (required sign-off).
---

# initiative-security-spec

## When to use

`/forge.initiative-design`, `/forge.initiative-planning`.

## Steps

1. Read initiative feature + architect spec + `security/threat-model.md` for context.
2. Propose `security.md`: summary, threats, mitigations, requirements.
3. Unsettled security forks → initiative `open-questions.md` (blocking when they block HLD exit).
4. Ticket-level security sections still land in the tech spec comment at LLD refinement.
5. When event-spawned: propose-only; do not Apply; do not flip signoffs.

## Outputs / stop conditions

Updated `security.md` or incomplete callouts for the planning gate.
