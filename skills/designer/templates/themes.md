---
doc: design.themes
schema_version: 1
updated: 1970-01-01
themes: []
---

<!--
Authoring (not validated):
- Frontmatter is source of truth; body is expansion-only.
- Bump updated when any frontmatter field changes. Empty body OK at init.
- themes[] objects: app (submodulePath), figma_url, figma_file_key, status (unbound|bound|stale), last_audited (YYYY-MM-DD or "").
- One theme row per app/submodule. Figma file is SoT for tokens/screens; this doc binds the URL.
-->
