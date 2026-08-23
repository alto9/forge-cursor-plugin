---
name: validate-memory
description: >-
  Validate proposed memory markdown against role templates (required H2s) or
  frontmatter schemas (all product/* docs), and forge.json required fields.
  Blocks Apply on schema/template errors; warnings (e.g. weak brief) do not block.
---

# validate-memory

## When to use

Parent command runs this before Apply on any proposed memory write; also after init-memory / ensure-config seeding.

## Steps

1. For each proposed memory markdown file, load the matching role template or schema (see `init-memory` map / `scripts/validate-memory.js`).
2. **Heading docs** (non-product memory files): require all template H2 headings; forbid extra H2s; empty sections OK.
3. **Schema docs** (all `product/*`, including `product/specs/<feature>.md`): validate YAML frontmatter against the registered schema (`doc`, `schema_version`, typed fields). Body is expansion-only; empty body OK. Forbidden body: changelogs, history, dated decision logs.
4. Validate forge.json: required fields; `path == submodulePath`; host block matches `host`.
5. On **errors**: include in HITL hand-off and **block Apply** for invalid files. Valid proposed files in the same apply-set may still Apply.
6. On **warnings** (weak brief, body soft-max, not-strong goals): include in HITL hand-off; **do not** block Apply. Readiness warnings are advisory only — no command gates.

## Script

```bash
node scripts/validate-memory.js --memory-root <memoryRoot> [--file relpath ...] [--require-board]
node scripts/validate-memory.js --forge-json <path> --submodule-path <path>
```

JSON output: `{ ok, errors[], warnings[] }`. Exit 1 only when `errors` is non-empty.

## Outputs / stop conditions

Pass (no errors) → Apply may proceed for that file. Fail → no Apply for invalid files. Warnings never stop Apply.
