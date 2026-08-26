import { describe, it, expect } from "vitest";
import { validateDesignThemes } from "../../scripts/memory/schemas/design-themes-v1.js";
import { validateDesignStructure } from "../../scripts/memory/schemas/design-structure-v1.js";
import { validateDesignTokens } from "../../scripts/memory/schemas/design-tokens-v1.js";
import { validateDesignScreens } from "../../scripts/memory/schemas/design-screens-v1.js";
import { validateDesignComponents } from "../../scripts/memory/schemas/design-components-v1.js";
import { validateDesignPrinciples } from "../../scripts/memory/schemas/design-principles-v1.js";

describe("design.* schemas", () => {
  it("accepts empty themes frontmatter", () => {
    const md = `---
doc: design.themes
schema_version: 1
updated: 2026-08-23
themes: []
---
`;
    const result = validateDesignThemes(md);
    expect(result.errors).toEqual([]);
  });

  it("accepts theme objects", () => {
    const md = `---
doc: design.themes
schema_version: 1
updated: 2026-08-23
themes:
  - app: my-app
    figma_url: https://www.figma.com/design/abc/Theme
    figma_file_key: abc
    status: bound
    last_audited: "2026-08-23"
---
`;
    const result = validateDesignThemes(md);
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.themes).toHaveLength(1);
  });

  it("rejects non-object theme entries", () => {
    const md = `---
doc: design.themes
schema_version: 1
updated: 2026-08-23
themes:
  - just-a-string
---
`;
    const result = validateDesignThemes(md);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects bound theme without figma_url and figma_file_key", () => {
    const md = `---
doc: design.themes
schema_version: 1
updated: 2026-08-23
themes:
  - app: my-app
    figma_url: ""
    figma_file_key: ""
    status: bound
    last_audited: ""
---
`;
    const result = validateDesignThemes(md);
    expect(result.errors.some((e) => e.includes("figma_url"))).toBe(true);
    expect(result.errors.some((e) => e.includes("figma_file_key"))).toBe(true);
  });

  it("accepts empty structure frontmatter", () => {
    const md = `---
doc: design.structure
schema_version: 1
updated: 2026-08-23
structure_status: unverified
structure_gaps: []
last_checked: ""
required_pages_found: []
required_variable_patterns_missing: []
required_component_categories_missing: []
---
`;
    expect(validateDesignStructure(md).errors).toEqual([]);
  });

  it("accepts structure pass with empty gaps", () => {
    const md = `---
doc: design.structure
schema_version: 1
updated: 2026-08-23
structure_status: pass
structure_gaps: []
last_checked: "2026-08-23"
required_pages_found:
  - Brand
  - Tokens
  - Components
  - Screens
required_variable_patterns_missing: []
required_component_categories_missing: []
---
`;
    expect(validateDesignStructure(md).errors).toEqual([]);
  });

  it("rejects structure pass with non-empty gaps", () => {
    const md = `---
doc: design.structure
schema_version: 1
updated: 2026-08-23
structure_status: pass
structure_gaps:
  - missing Tokens page
last_checked: "2026-08-23"
required_pages_found: []
required_variable_patterns_missing: []
required_component_categories_missing: []
---
`;
    const result = validateDesignStructure(md);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects invalid structure_status", () => {
    const md = `---
doc: design.structure
schema_version: 1
updated: 2026-08-23
structure_status: maybe
structure_gaps: []
last_checked: ""
required_pages_found: []
required_variable_patterns_missing: []
required_component_categories_missing: []
---
`;
    const result = validateDesignStructure(md);
    expect(result.errors.some((e) => e.includes("structure_status"))).toBe(
      true
    );
  });

  it("accepts empty tokens", () => {
    const md = `---
doc: design.tokens
schema_version: 1
updated: 2026-08-23
color: []
typography: []
spacing: []
radius: []
elevation: []
gaps: []
---
`;
    expect(validateDesignTokens(md).errors).toEqual([]);
  });

  it("accepts empty screens and components", () => {
    expect(
      validateDesignScreens(`---
doc: design.screens
schema_version: 1
updated: 2026-08-23
screens: []
---
`).errors
    ).toEqual([]);
    expect(
      validateDesignComponents(`---
doc: design.components
schema_version: 1
updated: 2026-08-23
components: []
---
`).errors
    ).toEqual([]);
  });

  it("accepts empty principles", () => {
    const md = `---
doc: design.principles
schema_version: 1
updated: 2026-08-23
principles: []
a11y_rules: []
interaction_patterns: []
anti_patterns: []
---
`;
    expect(validateDesignPrinciples(md).errors).toEqual([]);
  });
});
