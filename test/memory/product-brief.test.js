import { describe, it, expect } from "vitest";
import {
  parseProductBrief,
  BODY_SOFT_MAX,
} from "../../scripts/memory/schemas/product-brief-v1.js";
import { parseProductBriefV2 } from "../../scripts/memory/schemas/product-brief-v2.js";
import { validateSchemaDoc } from "../../scripts/memory/schema-registry.js";

function briefV1(overrides = {}, narrative = "") {
  const base = {
    doc: "product.brief",
    schema_version: 1,
    updated: "2026-08-21",
    product: "Acme",
    problem: "Shipping is slow",
    audience: ["builders"],
    goals: ["Ship faster"],
    non_goals: ["Rebuild everything"],
    success_metrics: [{ metric: "time-to-ship", target: "< 1 week" }],
    current_focus: "Brief v1",
    ...overrides,
  };
  const metricsYaml =
    Array.isArray(base.success_metrics) && base.success_metrics.length === 0
      ? "success_metrics: []"
      : Array.isArray(base.success_metrics)
        ? [
            "success_metrics:",
            ...base.success_metrics.map(
              (m) =>
                `  - metric: ${JSON.stringify(m.metric)}\n    target: ${JSON.stringify(m.target)}`
            ),
          ].join("\n")
        : `success_metrics: ${JSON.stringify(base.success_metrics)}`;
  const yaml = [
    "---",
    `doc: ${base.doc}`,
    `schema_version: ${base.schema_version}`,
    `updated: ${base.updated}`,
    `product: ${JSON.stringify(base.product)}`,
    `problem: ${JSON.stringify(base.problem)}`,
    `audience: ${JSON.stringify(base.audience)}`,
    `goals: ${JSON.stringify(base.goals)}`,
    `non_goals: ${JSON.stringify(base.non_goals)}`,
    metricsYaml,
    `current_focus: ${JSON.stringify(base.current_focus)}`,
    "---",
    narrative,
  ].join("\n");
  return yaml;
}

function briefV2(overrides = {}, narrative = "") {
  const base = {
    doc: "product.brief",
    schema_version: 2,
    updated: "2026-08-21",
    product_name: "Acme",
    product_description: "A shipping toolkit",
    problem: "Shipping is slow",
    audience: ["builders"],
    goals: ["Ship faster"],
    non_goals: ["Rebuild everything"],
    success_metrics: [{ metric: "time-to-ship", target: "< 1 week" }],
    current_focus: "Brief v2",
    ...overrides,
  };
  const metricsYaml =
    Array.isArray(base.success_metrics) && base.success_metrics.length === 0
      ? "success_metrics: []"
      : Array.isArray(base.success_metrics)
        ? [
            "success_metrics:",
            ...base.success_metrics.map(
              (m) =>
                `  - metric: ${JSON.stringify(m.metric)}\n    target: ${JSON.stringify(m.target)}`
            ),
          ].join("\n")
        : `success_metrics: ${JSON.stringify(base.success_metrics)}`;
  const yaml = [
    "---",
    `doc: ${base.doc}`,
    `schema_version: ${base.schema_version}`,
    `updated: ${base.updated}`,
    `product_name: ${JSON.stringify(base.product_name)}`,
    `product_description: ${JSON.stringify(base.product_description)}`,
    `problem: ${JSON.stringify(base.problem)}`,
    `audience: ${JSON.stringify(base.audience)}`,
    `goals: ${JSON.stringify(base.goals)}`,
    `non_goals: ${JSON.stringify(base.non_goals)}`,
    metricsYaml,
    `current_focus: ${JSON.stringify(base.current_focus)}`,
    "---",
    narrative,
  ].join("\n");
  return yaml;
}

describe("parseProductBrief (v1)", () => {
  it("accepts valid minimal v1 brief with empty body and empty strings", () => {
    const md = briefV1({
      product: "",
      problem: "",
      audience: [],
      goals: [],
      non_goals: [],
      success_metrics: [],
      current_focus: "",
    });
    const result = parseProductBrief(md);
    expect(result.errors).toEqual([]);
    expect(result.parsed).not.toBeNull();
    expect(result.parsed.narrative).toBe("");
    expect(result.parsed.meta.doc).toBe("product.brief");
    expect(result.warnings.some((w) => w.includes("weak brief"))).toBe(true);
  });

  it("rejects wrong schema_version", () => {
    const md = briefV1({ schema_version: 99 });
    const result = parseProductBrief(md);
    expect(result.errors.some((e) => e.includes("schema_version"))).toBe(true);
  });

  it("rejects bad success_metrics shape", () => {
    const md = `---
doc: product.brief
schema_version: 1
updated: 2026-08-21
product: "x"
problem: "y"
audience: []
goals: []
non_goals: []
success_metrics:
  - not_an_object
current_focus: "z"
---
`;
    const result = parseProductBrief(md);
    expect(result.errors.some((e) => e.includes("success_metrics"))).toBe(true);
  });

  it("rejects forbidden Changelog heading in body", () => {
    const result = parseProductBrief(briefV1({}, "## Changelog\n\nstuff\n"));
    expect(result.errors.some((e) => e.includes("changelog"))).toBe(true);
  });

  it("warns on weak brief without failing", () => {
    const result = parseProductBrief(
      briefV1({ product: "", problem: "p", current_focus: "c", goals: ["g"] })
    );
    expect(result.errors).toEqual([]);
    expect(result.warnings.some((w) => w.includes("weak brief"))).toBe(true);
  });

  it("warns when body exceeds soft max", () => {
    const result = parseProductBrief(briefV1({}, "x".repeat(BODY_SOFT_MAX + 1)));
    expect(result.errors).toEqual([]);
    expect(result.warnings.some((w) => w.includes("soft max"))).toBe(true);
  });

  it("rejects legacy heading-only brief", () => {
    const legacy = `# Product

# Problem

# Who it's for

# Goals

# Non-goals

# Success metrics

# Current focus
`;
    const result = parseProductBrief(legacy);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.parsed).toBeNull();
  });

  it("returns normalized shape", () => {
    const result = parseProductBrief(briefV1({}, "Some nuance."));
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.product).toBe("Acme");
    expect(result.parsed.narrative).toBe("Some nuance.");
    expect(result.parsed.meta.path).toBe("product/brief.md");
  });
});

describe("parseProductBriefV2", () => {
  it("accepts valid minimal v2 brief with empty body and empty strings", () => {
    const md = briefV2({
      product_name: "",
      product_description: "",
      problem: "",
      audience: [],
      goals: [],
      non_goals: [],
      success_metrics: [],
      current_focus: "",
    });
    const result = parseProductBriefV2(md);
    expect(result.errors).toEqual([]);
    expect(result.parsed).not.toBeNull();
    expect(result.parsed.meta.schema_version).toBe(2);
    expect(result.warnings.some((w) => w.includes("weak brief"))).toBe(true);
  });

  it("warns on empty product_name without requiring product_description", () => {
    const result = parseProductBriefV2(
      briefV2({
        product_name: "",
        product_description: "",
        problem: "p",
        current_focus: "c",
        goals: ["g"],
      })
    );
    expect(result.errors).toEqual([]);
    expect(result.warnings.some((w) => w.includes("product_name"))).toBe(true);
    expect(result.warnings.some((w) => w.includes("product_description"))).toBe(
      false
    );
  });

  it("returns normalized v2 shape", () => {
    const result = parseProductBriefV2(briefV2({}, "Some nuance."));
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.product_name).toBe("Acme");
    expect(result.parsed.core.product_description).toBe("A shipping toolkit");
    expect(result.parsed.narrative).toBe("Some nuance.");
  });

  it("rejects v1 product field shape when validated as v2", () => {
    const md = briefV1();
    const result = parseProductBriefV2(md);
    expect(result.errors.some((e) => e.includes("schema_version"))).toBe(true);
  });
});

describe("validateSchemaDoc routing", () => {
  it("errors on unsupported schema_version", () => {
    const md = briefV1({ schema_version: 99 });
    const result = validateSchemaDoc("product/brief.md", md);
    expect(result.errors.some((e) => e.includes("unsupported schema_version"))).toBe(
      true
    );
  });

  it("routes schema_version 2 to v2 validator", () => {
    const result = validateSchemaDoc("product/brief.md", briefV2());
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.product_name).toBe("Acme");
  });

  it("still routes schema_version 1 to v1 validator", () => {
    const result = validateSchemaDoc("product/brief.md", briefV1());
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.product).toBe("Acme");
  });
});
