# Memory schemas

Pluggable frontmatter schemas for Forge memory docs. All seeded memory files use schema validation; heading-template validation remains only for legacy unmigrated files outside `DOC_TEMPLATE_MAP`.

## How it works

1. `scripts/validate-memory.js` validates each proposed memory file.
2. If `schemaEntryForPath(relPath)` resolves ([`scripts/memory/schema-registry.js`](../scripts/memory/schema-registry.js)), run the schema validator.
3. Otherwise, match required `#` headings against the role template (`DOC_TEMPLATE_MAP`).

**All seeded memory docs** (schema-backed):

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
| `product/open-questions.md` | `product.open_questions_index` |
| `product/specs/<feature>.md` | `product.spec` (soft-deprecated; prefer initiatives) |
| `initiatives/<slug>/initiative.md` | `product.initiative` |
| `initiatives/<slug>/open-questions.md` | `product.open_questions` |
| `initiatives/<slug>/spec.md` | `product.initiative_spec` |
| `initiatives/<slug>/design.md` | `product.initiative_design` |
| `initiatives/<slug>/security.md` | `product.initiative_security` |
| `architecture/overview.md` | `architecture.overview` |
| `architecture/constraints.md` | `architecture.constraints` |
| `architecture/interfaces.md` | `architecture.interfaces` |
| `architecture/decisions.md` | `architecture.decisions` |
| `architecture/risks.md` | `architecture.risks` |
| `engineering/in-flight.md` | `engineering.in_flight` |
| `project/plan.md` | `project.plan` |
| `project/status.md` | `project.status` |
| `project/risks.md` | `project.risks` |
| `project/milestones.md` | `project.milestones` |
| `qa/queue.md` | `qa.queue` |
| `qa/findings.md` | `qa.findings` |
| `qa/test-plan.md` | `qa.test_plan` |
| `security/threat-model.md` | `security.threat_model` |
| `security/findings.md` | `security.findings` |
| `security/checklist.md` | `security.checklist` |
| `release/checklist.md` | `release.checklist` |
| `release/notes.md` | `release.notes` |
| `release/status.md` | `release.status` |
| `marketing/positioning.md` | `marketing.positioning` |
| `marketing/messaging.md` | `marketing.messaging` |
| `marketing/voice.md` | `marketing.voice` |
| `marketing/calendar.md` | `marketing.calendar` |
| `marketing/social-queue.md` | `marketing.social_queue` |
| `design/themes.md` | `design.themes` |
| `design/structure.md` | `design.structure` |
| `design/tokens.md` | `design.tokens` |
| `design/screens.md` | `design.screens` |
| `design/components.md` | `design.components` |
| `design/principles.md` | `design.principles` |

Shared helpers: [`scripts/memory/schema-common.js`](../scripts/memory/schema-common.js) (`createProductDocSchema`).

**Gherkin `.feature` files** under `initiatives/<slug>/features/` are not YAML-frontmatter docs. `validate-memory` checks they exist, are non-empty, and contain `Feature:` plus at least one `Scenario:` (see [`scripts/memory/validate-gherkin-feature.js`](../scripts/memory/validate-gherkin-feature.js)). HLD uses `initiative.feature`; LLD creates one `<ticket-slug>.feature` per ticket.

CLI JSON: `{ ok, errors[], warnings[] }`. Exit 1 only when `errors` is non-empty. Warnings (weak brief, body soft-max, legacy headings) never block Apply.

## Register a new schema

1. Add `scripts/memory/schemas/<doc>-vN.js` using `createProductDocSchema` (or a custom validator).
2. Register the memory path (or glob rule) in `schema-registry.js`.
3. Replace the role template with frontmatter + optional body authoring hints.
4. Keep the path in `DOC_TEMPLATE_MAP` so `init-memory` can seed it.
5. Bump `schema_version` on breaking field changes; old files fail validation on next Apply (no migration scripts — rewrite under HITL).
6. Add tests under `test/memory/`.

Reference: [`product-brief-v1.js`](../scripts/memory/schemas/product-brief-v1.js) (legacy `product` field) and [`product-brief-v2.js`](../scripts/memory/schemas/product-brief-v2.js) (`product_name` + `product_description`).

## Error vs warning

| Kind | Blocks Apply | Examples |
|------|--------------|----------|
| **Error** | Yes | Missing frontmatter, wrong `doc` / `schema_version`, bad types, forbidden body sections |
| **Warning** | No | Weak brief (empty `product_name` / `problem` / `current_focus`), no goals (not strong), body over soft max, legacy `#` headings in body |

Readiness warnings are advisory only. No event command gates on brief strength.

## Upgrade policy

- No automated migration.
- Unsupported or missing `schema_version` → hard error.
- Operator/agent reworks the file to the current template under HITL.
- Per-file Apply: invalid proposed files block; valid files in the same apply-set may still Apply.
