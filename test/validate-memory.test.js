import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  validateDocAgainstTemplate,
  validateForgeJson,
  extractTemplateHeadings,
  validateMemoryRoot,
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

describe("validateMemoryRoot schema + mixed apply-set", () => {
  function tmpRoot(files) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    for (const [rel, content] of Object.entries(files)) {
      const abs = path.join(dir, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content, "utf8");
    }
    return dir;
  }

  const weakBrief = `---
doc: product.brief
schema_version: 2
updated: 2026-08-21
product_name: ""
product_description: ""
problem: ""
audience: []
goals: []
non_goals: []
success_metrics: []
current_focus: ""
---
`;

  const validRoadmap = `---
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

  const invalidBrief = `# Product

# Problem
`;

  it("returns warnings without failing ok for weak brief", () => {
    const root = tmpRoot({ "product/brief.md": weakBrief });
    const { errors, warnings } = validateMemoryRoot(root, {
      files: ["product/brief.md"],
    });
    expect(errors).toEqual([]);
    expect(warnings.some((w) => w.includes("weak brief"))).toBe(true);
  });

  it("validates files independently in a mixed apply-set", () => {
    const root = tmpRoot({
      "product/brief.md": invalidBrief,
      "product/roadmap.md": validRoadmap,
    });
    const { errors } = validateMemoryRoot(root, {
      files: ["product/brief.md", "product/roadmap.md"],
    });
    expect(errors.some((e) => e.startsWith("product/brief.md:"))).toBe(true);
    expect(errors.some((e) => e.startsWith("product/roadmap.md:"))).toBe(false);
  });
});
