---
doc: design.structure
schema_version: 1
updated: 1970-01-01
structure_status: unverified
structure_gaps: []
last_checked: ""
required_pages_found: []
required_variable_patterns_missing: []
required_component_categories_missing: []
---

<!--
Authoring (not validated):
- Frontmatter is source of truth; body is expansion-only.
- Bump updated when any frontmatter field changes. Empty body OK at init.
- structure_status: unverified | pass | fail
- structure_gaps[]: human-readable structural misses (not content/value diffs)
- last_checked: YYYY-MM-DD or ""
- required_pages_found[]: page roles matched (e.g. Brand, Tokens, Components, Screens)
- required_variable_patterns_missing[]: pattern families still missing (e.g. color, spacing)
- required_component_categories_missing[]: categories still missing (e.g. Button, Link)
- Projection from design-structure-check via Figma MCP. Fail on missing structure;
  never fail because two apps use different brand colors.
-->
