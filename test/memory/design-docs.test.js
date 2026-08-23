import { describe, it, expect } from "vitest";
import { validateDesignThemes } from "../../scripts/memory/schemas/design-themes-v1.js";
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
