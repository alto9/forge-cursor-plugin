import { describe, it, expect } from "vitest";
import {
  validateDocAgainstTemplate,
  validateForgeJson,
  extractTemplateHeadings,
} from "../scripts/validate-memory.js";

describe("validateDocAgainstTemplate", () => {
  const template = "# Product\n\n# Problem\n\n# Goals\n";

  it("accepts exact headings with empty sections", () => {
    const doc = "# Product\n\n# Problem\n\n# Goals\n";
    expect(validateDocAgainstTemplate(doc, template)).toEqual([]);
  });

  it("rejects missing headings", () => {
    const doc = "# Product\n\n# Problem\n";
    expect(validateDocAgainstTemplate(doc, template)).toContain(
      "Missing required heading: # Goals"
    );
  });

  it("rejects extra headings", () => {
    const doc = "# Product\n\n# Problem\n\n# Goals\n\n# History\n";
    expect(validateDocAgainstTemplate(doc, template)).toContain(
      "Extra heading not in template: # History"
    );
  });
});

describe("extractTemplateHeadings", () => {
  it("reads single-hash section markers", () => {
    expect(extractTemplateHeadings("# A\n\n# B\n")).toEqual(["A", "B"]);
  });
});

describe("validateForgeJson", () => {
  it("requires identity fields", () => {
    const errs = validateForgeJson({ version: 1 }, "apps/foo");
    expect(errs.some((e) => e.includes("path"))).toBe(true);
    expect(errs.some((e) => e.includes("host"))).toBe(true);
  });

  it("accepts minimal github config", () => {
    const errs = validateForgeJson(
      {
        version: 1,
        path: "apps/foo",
        host: "github",
        github: { owner: "acme", repo: "foo" },
      },
      "apps/foo"
    );
    expect(errs).toEqual([]);
  });

  it("requires board fields when requireBoard", () => {
    const errs = validateForgeJson(
      {
        version: 1,
        path: "apps/foo",
        host: "github",
        github: { owner: "acme", repo: "foo" },
      },
      "apps/foo",
      { requireBoard: true }
    );
    expect(errs.some((e) => e.includes("projectId"))).toBe(true);
  });

  it("flags path mismatch", () => {
    const errs = validateForgeJson(
      {
        version: 1,
        path: "apps/bar",
        host: "gitlab",
        gitlab: { projectId: "g/foo" },
      },
      "apps/foo"
    );
    expect(errs.some((e) => e.includes("!="))).toBe(true);
  });
});
