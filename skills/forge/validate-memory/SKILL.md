---
name: validate-memory
description: >-
  Validate proposed memory markdown against role templates (required H2s) and forge.json required fields. Blocks Apply on failure.
---

# validate-memory

## When to use

Parent command runs this before Apply on any proposed memory write; also after init-memory / ensure-config seeding.

## Steps

1. For each proposed memory markdown file, load the matching role template (see `init-memory` map / `scripts/validate-memory.js`).
2. Require all template H2 headings; forbid extra H2s; empty sections OK.
3. Validate forge.json: required fields; `path == submodulePath`; host block matches `host`.
4. On failure: include errors in HITL hand-off and **block Apply** for invalid files.

## Script

```bash
node scripts/validate-memory.js --memory-root <memoryRoot> [--file relpath ...] [--require-board]
node scripts/validate-memory.js --forge-json <path> --submodule-path <path>
```

## Outputs / stop conditions

Pass → Apply may proceed. Fail → no Apply for invalid files.
