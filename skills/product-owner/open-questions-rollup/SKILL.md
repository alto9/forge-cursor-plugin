---
name: open-questions-rollup
description: >-
  Rebuild product/open-questions.md from initiatives/*/open-questions.md.
---

# open-questions-rollup

## When to use

`/forge.initiative-planning` (required); optionally after new-initiative.

## Steps

1. Scan `initiatives/*/open-questions.md`.
2. For each question with status open or deferred, add an index item: `{ initiative: <slug>, id, question, blocking, status }`.
3. Propose replace of `product/open-questions.md` items array (current state only — no history).
4. Bump `updated` on the index file.
5. When event-spawned: propose-only; do not Apply.

## Outputs / stop conditions

Updated rollup proposal for parent Apply.
