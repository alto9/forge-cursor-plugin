import { describe, it, expect } from "vitest";
import { validateSchemaDoc, isSchemaDoc } from "../../scripts/memory/schema-registry.js";
import { validateProductRoadmap } from "../../scripts/memory/schemas/product-roadmap-v1.js";
import { validateProductMetrics } from "../../scripts/memory/schemas/product-metrics-v1.js";
import { validateProductSpec } from "../../scripts/memory/schemas/product-spec-v1.js";

describe("product doc schemas", () => {
  it("accepts empty roadmap frontmatter", () => {
    const md = `---
doc: product.roadmap
schema_version: 1
updated: 2026-08-21
themes: []
now: []
next: []
later: []
not_planning: []
---
`;
    const result = validateProductRoadmap(md);
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.themes).toEqual([]);
  });

  it("rejects legacy heading-only roadmap", () => {
    const result = validateProductRoadmap("# Themes\n\n# Now\n");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("validates metrics targets shape", () => {
    const md = `---
doc: product.metrics
schema_version: 1
updated: 2026-08-21
primary: ["activation"]
supporting: []
targets:
  - metric: activation
    target: "40%"
current_read: "Holding"
---
`;
    const result = validateProductMetrics(md);
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.targets[0].metric).toBe("activation");
  });

  it("routes product/specs/*.md to product.spec", () => {
    expect(isSchemaDoc("product/specs/sharing.md")).toBe(true);
    const md = `---
doc: product.spec
schema_version: 1
updated: 2026-08-21
feature: "Sharing"
problem: ""
users: []
requirements: []
acceptance_criteria: []
out_of_scope: []
constraints: []
verification: ""
open_questions: []
success_metrics: []
---
`;
    const result = validateSchemaDoc("product/specs/sharing.md", md);
    expect(result.errors).toEqual([]);
    expect(result.parsed.meta.path).toBe("product/specs/sharing.md");
    expect(result.parsed.core.feature).toBe("Sharing");
  });

  it("validateProductSpec rejects wrong doc id", () => {
    const md = `---
doc: product.brief
schema_version: 1
updated: 2026-08-21
feature: "x"
problem: ""
users: []
requirements: []
acceptance_criteria: []
out_of_scope: []
constraints: []
verification: ""
open_questions: []
success_metrics: []
---
`;
    const result = validateProductSpec(md);
    expect(result.errors.some((e) => e.includes("product.spec"))).toBe(true);
  });
});
