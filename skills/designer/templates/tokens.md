---
doc: design.tokens
schema_version: 1
updated: 1970-01-01
color: []
typography: []
spacing: []
radius: []
elevation: []
gaps: []
---

<!--
Authoring (not validated):
- Frontmatter is source of truth; body is expansion-only.
- Bump updated when any frontmatter field changes. Empty body OK at init.
- Projection from Figma variables (get_variable_defs). Prefer Figma over inventing entries.
- Each family entry is an object: name, figma_variable_id. Store refs only — no hex, type sizes, or spacing numbers.
- gaps[] lists optional inventory notes (strings).
- Required naming/pattern misses belong in design/structure.md (design-structure-check), not here.
-->
