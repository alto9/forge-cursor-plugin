# Memory schemas

Pluggable frontmatter schemas for Forge memory docs. Heading-template validation remains the default for unmigrated files.

## How it works

1. `scripts/validate-memory.js` validates each proposed memory file.
2. If the path is in `SCHEMA_DOC_MAP` ([`scripts/memory/schema-registry.js`](../scripts/memory/schema-registry.js)), run the schema validator.
3. Otherwise, match required `#` headings against the role template (`DOC_TEMPLATE_MAP`).

CLI JSON: `{ ok, errors[], warnings[] }`. Exit 1 only when `errors` is non-empty. Warnings (weak brief, body soft-max) never block Apply.

## Register a new schema

1. Add `scripts/memory/schemas/<doc>-vN.js` exporting a validator `(markdown, relPath) => { errors, warnings, parsed }`.
2. Register the memory path and version in `SCHEMA_DOC_MAP` in `schema-registry.js`.
3. Replace the role template with frontmatter + optional body authoring hints.
4. Keep the path in `DOC_TEMPLATE_MAP` so `init-memory` can seed it.
5. Bump `schema_version` on breaking field changes; old files fail validation on next Apply (no migration scripts — rewrite under HITL).
6. Add tests under `test/memory/`.

Reference implementation: [`parseProductBrief`](../scripts/memory/schemas/product-brief-v1.js) for `product/brief.md` (`doc: product.brief`, `schema_version: 1`).

## Error vs warning

| Kind | Blocks Apply | Examples |
|------|--------------|----------|
| **Error** | Yes | Missing frontmatter, wrong `doc` / `schema_version`, bad types, forbidden body sections |
| **Warning** | No | Weak brief (empty `product` / `problem` / `current_focus`), no goals (not strong), body over soft max |

Readiness warnings are advisory only. No event command gates on brief strength.

## Upgrade policy

- No automated migration.
- Unsupported or missing `schema_version` → hard error.
- Operator/agent reworks the file to the current template under HITL.
- Per-file Apply: invalid proposed files block; valid files in the same apply-set may still Apply.
