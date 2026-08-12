---
name: implement-ticket
description: >-
  Implement one agent-ready board ticket in the submodule. Stop and send back
  to grooming if the issue body fails the Ready gate.
---

# implement-ticket

## When to use

`/implement-ticket` or Engineer agent when taking Ready work.

## Steps

1. Load the board issue body (vendor get) and linked `product/specs/<feature>.md` if any.
2. If status is Refinement or it fails `skills/product-owner/agent-ready-ticket` → **stop**. Hand off to `/refinement`; do not invent scope.
3. Read architecture constraints/interfaces and engineering/in-flight. Implement the smallest change that meets Acceptance criteria + Verification.
4. Propose in-flight / QA queue updates per the parent command. **Board/SCM wins** over memory.
5. When event-spawned: propose-only hand-off; do not Apply until parent Apply.

## Outputs / stop conditions

Code/tests meeting acceptance, or a stop hand-off if not agent-ready.
