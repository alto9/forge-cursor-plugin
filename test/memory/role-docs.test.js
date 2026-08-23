import { describe, it, expect } from "vitest";
import { validateSchemaDoc, isSchemaDoc } from "../../scripts/memory/schema-registry.js";
import { validateArchitectureOverview } from "../../scripts/memory/schemas/architecture-overview-v1.js";
import { validateProjectStatus } from "../../scripts/memory/schemas/project-status-v1.js";
import { validateEngineeringInFlight } from "../../scripts/memory/schemas/engineering-in-flight-v1.js";
import { validateQaQueue } from "../../scripts/memory/schemas/qa-queue-v1.js";
import { validateSecurityChecklist } from "../../scripts/memory/schemas/security-checklist-v1.js";
import { validateReleaseChecklist } from "../../scripts/memory/schemas/release-checklist-v1.js";
import { validateMarketingPositioning } from "../../scripts/memory/schemas/marketing-positioning-v1.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DOC_TEMPLATE_MAP } from "../../scripts/validate-memory.js";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("role doc schemas", () => {
  it("accepts empty architecture overview frontmatter", () => {
    const md = `---
doc: architecture.overview
schema_version: 1
updated: 2026-08-22
system: ""
context: ""
data_flow: ""
deployment_shape: ""
current_focus: ""
major_components: []
---
`;
    const result = validateArchitectureOverview(md);
    expect(result.errors).toEqual([]);
    expect(result.parsed.core.system).toBe("");
  });

  it("rejects legacy heading-only project status", () => {
    const result = validateProjectStatus("# Summary\n\n# In flight\n");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("validates engineering in-flight", () => {
    const md = `---
doc: engineering.in_flight
schema_version: 1
updated: 2026-08-22
approach: ""
review_state: ""
active: []
open_questions: []
blockers: []
---
`;
    const result = validateEngineeringInFlight(md);
    expect(result.errors).toEqual([]);
  });

  it("routes all seeded memory paths to schemas", () => {
    for (const rel of Object.keys(DOC_TEMPLATE_MAP)) {
      expect(isSchemaDoc(rel)).toBe(true);
    }
  });

  it("validates templates from disk", () => {
    for (const [rel, tmplRel] of Object.entries(DOC_TEMPLATE_MAP)) {
      const content = fs.readFileSync(path.join(pluginRoot, tmplRel), "utf8");
      const result = validateSchemaDoc(rel, content);
      expect(result.errors, `${rel} template invalid: ${result.errors.join("; ")}`).toEqual([]);
    }
  });

  it("sample role validators accept minimal frontmatter", () => {
    const samples = [
      [
        "qa/queue.md",
        validateQaQueue,
        `---
doc: qa.queue
schema_version: 1
updated: 2026-08-22
ready_for_qa: []
in_verification: []
passed_back: []
approved: []
---
`,
      ],
      [
        "security/checklist.md",
        validateSecurityChecklist,
        `---
doc: security.checklist
schema_version: 1
updated: 2026-08-22
secrets: []
dependencies: []
authn_authz: []
data_handling: []
config_defaults: []
release_gates: []
---
`,
      ],
      [
        "release/checklist.md",
        validateReleaseChecklist,
        `---
doc: release.checklist
schema_version: 1
updated: 2026-08-22
version_target: ""
pre_ship: []
gates: []
publish_steps: []
rollback: []
---
`,
      ],
      [
        "marketing/positioning.md",
        validateMarketingPositioning,
        `---
doc: marketing.positioning
schema_version: 1
updated: 2026-08-22
audience: ""
problem: ""
promise: ""
differentiator: ""
proof: []
non_positioning: []
---
`,
      ],
    ];
    for (const [, validate, md] of samples) {
      expect(validate(md).errors).toEqual([]);
    }
  });
});
