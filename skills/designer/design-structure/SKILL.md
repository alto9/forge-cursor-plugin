---
name: design-structure
description: >-
  designer reference: Figma file structure expectations (pages, variable naming
  patterns, component categories). Structure is agent knowledge; values stay
  per-app. Fail on missing structure; never fail because two apps use different
  brand colors.
---

# design-structure

## When to use

Load before `design-structure-check`, and whenever audits or Ready gates need the
canonical **structure vs content** rules. This skill is agent knowledge (like PO
knowing Ready needs labels). It is not a per-project config file.

## Structure vs content

| Enforce (structure) | Do not enforce (content) |
|---|---|
| Bound Figma file exists and MCP can open it | Hex values, brand artwork, typeface families |
| Required pages / sections present (fuzzy name match) | Exact page titles or frame art |
| Variable **naming patterns** (semantic roles) | Actual color/spacing values |
| Minimum component **categories** covered | Component visuals or variant styling |
| Ticket-level frame refs/states/a11y at refinement | Identical layouts across apps |

**Rule:** Fail on missing structure; never fail because two apps use different brand colors.

Optional human step (not enforced in v1): start from an org Figma template file. Structure checks still apply to whatever file is bound.

## Required pages (fuzzy match)

At least one page (or top-level section) whose name contains any synonym in each group:

| Role | Name contains (any) |
|---|---|
| Brand / foundations | `Brand`, `Foundations`, `Logos`, `Logo` |
| Tokens / variables | `Token`, `Tokens`, `Variable`, `Variables` |
| Components | `Component`, `Components`, `Library` |
| Screens / flows | `Screen`, `Screens`, `Flow`, `Flows` |

Matching is case-insensitive. Prefer presence of the page over exact title.

## Required variable naming patterns

Names matter; values do not. After `get_variable_defs`, require coverage of each pattern family (at least one variable whose name matches):

| Family | Pattern examples (slash or dash OK) |
|---|---|
| Semantic color | `color/<role>/<variant>` e.g. `color/background/primary`, `color/text/default`, `color/border/subtle`; also accept `color-*` with role segments |
| Spacing scale | `spacing/<step>` or `space-xs` … `space-xl` / `spacing/1` … |
| Radius | `radius/<size>` e.g. `radius/sm`, `radius/md` |
| Typography role | `font/<role>` e.g. `font/body`, `font/heading`, `font/caption` |

Fuzzy: collection or variable name contains the family root (`color`, `spacing`/`space`, `radius`, `font`) and a role/step segment. Missing an entire family → structure gap. Different hex for `color/background/primary` across apps → not a gap.

## Required component categories

Minimum categories (name flexible; category coverage required):

| Category | Accept names containing |
|---|---|
| Button | `Button`, `Btn` |
| Text input | `Input`, `TextField`, `Text Input`, `TextInput` |
| Link | `Link`, `Anchor` |

Orphans and duplicates stay `component-audit` concerns; missing a whole category is a structure gap.

## Outputs for other skills

`design-structure-check` returns pass/fail + human-readable `structure_gaps[]`. Memory projection: `design/structure.md`. Token inventory (`design/tokens.md`) is a ref catalog like screens (`name` + `figma_variable_id`); put naming/structure misses in `design/structure.md`, not as invented token entries.
