import { describe, it, expect } from "vitest";
import {
  isSchemaDoc,
  validateSchemaDoc,
} from "../../scripts/memory/schema-registry.js";
import { validateProductInitiative } from "../../scripts/memory/schemas/product-initiative-v1.js";
import { validateProductOpenQuestions } from "../../scripts/memory/schemas/product-open-questions-v1.js";
import {
  isInitiativeFeaturePath,
  validateGherkinFeature,
} from "../../scripts/memory/validate-gherkin-feature.js";
import { templateForMemoryDoc } from "../../scripts/validate-memory.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

describe("initiative schemas", () => {
  it("routes initiatives/<slug>/initiative.md", () => {
    expect(isSchemaDoc("initiatives/sharing/initiative.md")).toBe(true);
  });

  it("accepts empty initiative frontmatter", () => {
    const md = fs.readFileSync(
      path.join(pluginRoot, "skills/product-owner/templates/initiative.md"),
      "utf8"
    );
    const result = validateSchemaDoc("initiatives/sharing/initiative.md", md);
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.status).toBe("hld");
    expect(result.parsed.core.signoffs.designer).toBe("na");
  });

  it("rejects invalid status", () => {
    const md = `---
doc: product.initiative
schema_version: 1
updated: 2026-08-30
slug: "x"
title: ""
status: planning
user_facing: false
signoffs:
  po: false
  architect: false
  designer: "na"
  security: false
board_milestone: ""
board_tickets: []
---
`;
    const result = validateProductInitiative(md);
    expect(result.errors.some((e) => e.includes("status"))).toBe(true);
  });

  it("routes and validates open-questions", () => {
    expect(isSchemaDoc("initiatives/sharing/open-questions.md")).toBe(true);
    const md = fs.readFileSync(
      path.join(pluginRoot, "skills/product-owner/templates/open-questions.md"),
      "utf8"
    );
    const result = validateSchemaDoc(
      "initiatives/sharing/open-questions.md",
      md
    );
    expect(result.errors).toEqual([]);
  });

  it("validates open question object shape", () => {
    const md = `---
doc: product.open_questions
schema_version: 1
updated: 2026-08-30
questions:
  - id: OQ-1
    question: "Can guests view?"
    blocking: true
    status: open
    owner: product-owner
---
`;
    const result = validateProductOpenQuestions(md);
    expect(result.errors).toEqual([]);
  });

  it("routes initiative spec/design/security", () => {
    expect(isSchemaDoc("initiatives/sharing/spec.md")).toBe(true);
    expect(isSchemaDoc("initiatives/sharing/design.md")).toBe(true);
    expect(isSchemaDoc("initiatives/sharing/security.md")).toBe(true);
  });

  it("routes product/open-questions.md index", () => {
    expect(isSchemaDoc("product/open-questions.md")).toBe(true);
    const md = fs.readFileSync(
      path.join(
        pluginRoot,
        "skills/product-owner/templates/open-questions-index.md"
      ),
      "utf8"
    );
    const result = validateSchemaDoc("product/open-questions.md", md);
    expect(result.errors).toEqual([]);
  });

  it("resolves templates for initiative paths", () => {
    expect(templateForMemoryDoc("initiatives/x/initiative.md")).toBe(
      "skills/product-owner/templates/initiative.md"
    );
    expect(templateForMemoryDoc("initiatives/x/features/initiative.feature")).toBe(
      "skills/product-owner/templates/initiative.feature"
    );
  });
});

describe("gherkin feature validator", () => {
  it("detects initiative feature paths", () => {
    expect(
      isInitiativeFeaturePath("initiatives/sharing/features/initiative.feature")
    ).toBe(true);
    expect(
      isInitiativeFeaturePath("initiatives/sharing/features/ticket-a.feature")
    ).toBe(true);
    expect(isInitiativeFeaturePath("product/specs/x.md")).toBe(false);
  });

  it("accepts stub feature template", () => {
    const content = fs.readFileSync(
      path.join(pluginRoot, "skills/product-owner/templates/initiative.feature"),
      "utf8"
    );
    const result = validateGherkinFeature(
      content,
      "initiatives/sharing/features/initiative.feature"
    );
    expect(result.errors).toEqual([]);
  });

  it("rejects empty feature", () => {
    const result = validateGherkinFeature("   ", "x.feature");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects feature without Scenario", () => {
    const result = validateGherkinFeature("Feature: Only\n", "x.feature");
    expect(result.errors.some((e) => e.includes("Scenario"))).toBe(true);
  });
});
