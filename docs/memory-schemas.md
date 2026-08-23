# Memory schemas

Pluggable frontmatter schemas for Forge memory docs. Heading-template validation remains the default for unmigrated (non-product) files.

## How it works

1. `scripts/validate-memory.js` validates each proposed memory file.
2. If `schemaEntryForPath(relPath)` resolves ([`scripts/memory/schema-registry.js`](../scripts/memory/schema-registry.js)), run the schema validator.
3. Otherwise, match required `#` headings against the role template (`DOC_TEMPLATE_MAP`).

**Product docs** (all schema-backed today):

| Path | `doc` id |
|------|----------|
| `product/brief.md` | `product.brief` |
| `product/roadmap.md` | `product.roadmap` |
| `product/backlog.md` | `product.backlog` |
| `product/metrics.md` | `product.metrics` |
| `product/insights.md` | `product.insights` |
| `product/competitive.md` | `product.competitive` |
| `product/personas.md` | `product.personas` |
| `product/experiments.md` | `product.experiments` |
| `product/specs/<feature>.md` | `product.spec` |

Shared helpers: [`scripts/memory/schema-common.js`](../scripts/memory/schema-common.js) (`createProductDocSchema`).

CLI JSON: `{ ok, errors[], warnings[] }`. Exit 1 only when `errors` is non-empty. Warnings (weak brief, body soft-max) never block Apply.

## Register a new schema

1. Add `scripts/memory/schemas/<doc>-vN.js` using `createProductDocSchema` (or a custom validator).
2. Register the memory path (or glob rule) in `schema-registry.js`.
3. Replace the role template with frontmatter + optional body authoring hints.
4. Keep the path in `DOC_TEMPLATE_MAP` so `init-memory` can seed it.
5. Bump `schema_version` on breaking field changes; old files fail validation on next Apply (no migration scripts — rewrite under HITL).
6. Add tests under `test/memory/`.

Reference: [`product-brief-v1.js`](../scripts/memory/schemas/product-brief-v1.js).

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
