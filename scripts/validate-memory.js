#!/usr/bin/env node
/**
 * Validate forge.json and memory markdown against plugin templates / schemas.
 *
 * Usage:
 *   node scripts/validate-memory.js --memory-root <path> [--file <relpath>]...
 *   node scripts/validate-memory.js --forge-json <path> --submodule-path <path>
 *   node scripts/validate-memory.js --check-doc <docpath> --template <templatepath>
 *
 * Exit 0 if valid (no errors); 1 if errors. Warnings never fail exit.
 * Prints JSON { ok, errors[], warnings[] }.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SCHEMA_DOC_MAP,
  isSchemaDoc,
  validateSchemaDoc,
  parseProductBrief,
  validateProductBrief,
} from "./memory/schema-registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, "..");

export function extractH2(markdown) {
  return [...markdown.matchAll(/^##[ \t]+(.+?)\s*$/gm)].map((m) => m[1].trim());
}

/** Templates use single # as H2-equivalent section markers in this harness */
export function extractTemplateHeadings(markdown) {
  return [...markdown.matchAll(/^#[ \t]+(.+?)\s*$/gm)].map((m) => m[1].trim());
}

export function validateDocAgainstTemplate(docMarkdown, templateMarkdown) {
  const errors = [];
  const required = extractTemplateHeadings(templateMarkdown);
  const docHeadings = extractTemplateHeadings(docMarkdown);
  const docSet = new Set(docHeadings);
  for (const h of required) {
    if (!docSet.has(h)) errors.push(`Missing required heading: # ${h}`);
  }
  const reqSet = new Set(required);
  for (const h of docHeadings) {
    if (!reqSet.has(h)) errors.push(`Extra heading not in template: # ${h}`);
  }
  return errors;
}

export function validateForgeJson(obj, submodulePath, { requireBoard = false } = {}) {
  const errors = [];
  if (obj == null || typeof obj !== "object") {
    return ["forge.json must be an object"];
  }
  for (const key of ["version", "path", "host"]) {
    if (obj[key] == null || obj[key] === "") errors.push(`Missing required field: ${key}`);
  }
  if (submodulePath && obj.path && obj.path !== submodulePath) {
    errors.push(`forge.json.path (${obj.path}) != submodulePath (${submodulePath})`);
  }
  if (obj.host === "github") {
    if (!obj.github?.owner) errors.push("Missing github.owner");
    if (!obj.github?.repo) errors.push("Missing github.repo");
    if (requireBoard) {
      if (!obj.github?.projectId) errors.push("Missing github.projectId (board sync)");
      if (!obj.github?.statusIds) errors.push("Missing github.statusIds (board sync)");
    }
  } else if (obj.host === "gitlab") {
    if (!obj.gitlab?.projectId) errors.push("Missing gitlab.projectId");
    if (requireBoard) {
      if (!obj.gitlab?.statusIds) errors.push("Missing gitlab.statusIds (board sync)");
    }
  } else if (obj.host) {
    errors.push(`host must be github|gitlab, got: ${obj.host}`);
  }
  return errors;
}

/** Map memory-relative doc path -> template path under plugin (seeding + heading docs) */
export const DOC_TEMPLATE_MAP = {
  "product/brief.md": "skills/product-owner/templates/brief.md",
  "product/roadmap.md": "skills/product-owner/templates/roadmap.md",
  "product/backlog.md": "skills/product-owner/templates/backlog.md",
  "product/metrics.md": "skills/product-owner/templates/metrics.md",
  "product/insights.md": "skills/product-owner/templates/insights.md",
  "product/competitive.md": "skills/product-owner/templates/competitive.md",
  "product/personas.md": "skills/product-owner/templates/personas.md",
  "product/experiments.md": "skills/product-owner/templates/experiments.md",
  "project/plan.md": "skills/project-manager/templates/plan.md",
  "project/status.md": "skills/project-manager/templates/status.md",
  "project/risks.md": "skills/project-manager/templates/risks.md",
  "project/milestones.md": "skills/project-manager/templates/milestones.md",
  "architecture/overview.md": "skills/architect/templates/overview.md",
  "architecture/constraints.md": "skills/architect/templates/constraints.md",
  "architecture/interfaces.md": "skills/architect/templates/interfaces.md",
  "architecture/decisions.md": "skills/architect/templates/decisions.md",
  "architecture/risks.md": "skills/architect/templates/risks.md",
  "engineering/in-flight.md": "skills/engineer/templates/in-flight.md",
  "qa/queue.md": "skills/quality-assurance/templates/queue.md",
  "qa/findings.md": "skills/quality-assurance/templates/findings.md",
  "qa/test-plan.md": "skills/quality-assurance/templates/test-plan.md",
  "security/threat-model.md": "skills/security/templates/threat-model.md",
  "security/findings.md": "skills/security/templates/findings.md",
  "security/checklist.md": "skills/security/templates/checklist.md",
  "release/checklist.md": "skills/release-manager/templates/checklist.md",
  "release/notes.md": "skills/release-manager/templates/notes.md",
  "release/status.md": "skills/release-manager/templates/status.md",
  "marketing/positioning.md": "skills/marketing-manager/templates/positioning.md",
  "marketing/messaging.md": "skills/marketing-manager/templates/messaging.md",
  "marketing/voice.md": "skills/marketing-manager/templates/voice.md",
  "marketing/calendar.md": "skills/marketing-manager/templates/calendar.md",
  "marketing/social-queue.md": "skills/marketing-manager/templates/social-queue.md",
};

export function templateForMemoryDoc(relPath) {
  if (DOC_TEMPLATE_MAP[relPath]) return DOC_TEMPLATE_MAP[relPath];
  if (relPath.startsWith("product/specs/") && relPath.endsWith(".md")) {
    return "skills/product-owner/templates/spec.md";
  }
  return null;
}

/**
 * Validate memory root. Returns { errors, warnings }.
 * Schema docs (e.g. product/brief.md) use frontmatter schemas; others use heading templates.
 */
export function validateMemoryRoot(memoryRoot, { files, submodulePath, requireBoard } = {}) {
  const errors = [];
  const warnings = [];
  const forgePath = path.join(memoryRoot, "forge.json");
  if (fs.existsSync(forgePath)) {
    let obj;
    try {
      obj = JSON.parse(fs.readFileSync(forgePath, "utf8"));
    } catch (e) {
      errors.push(`forge.json parse error: ${e.message}`);
      return { errors, warnings };
    }
    errors.push(
      ...validateForgeJson(obj, submodulePath || obj.path, { requireBoard })
    );
  } else if (files?.includes("forge.json")) {
    errors.push("forge.json missing");
  }

  const toCheck =
    files?.filter((f) => f !== "forge.json") ||
    Object.keys(DOC_TEMPLATE_MAP).filter((f) =>
      fs.existsSync(path.join(memoryRoot, f))
    );

  for (const rel of toCheck) {
    const abs = path.join(memoryRoot, rel);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing file: ${rel}`);
      continue;
    }
    const content = fs.readFileSync(abs, "utf8");

    if (isSchemaDoc(rel)) {
      const result = validateSchemaDoc(rel, content);
      for (const e of result.errors) {
        errors.push(e.startsWith(`${rel}:`) ? e : `${rel}: ${e}`);
      }
      for (const w of result.warnings) {
        warnings.push(w.startsWith(`${rel}:`) ? w : `${rel}: ${w}`);
      }
      continue;
    }

    const tmplRel = templateForMemoryDoc(rel);
    if (!tmplRel) continue;
    const tmplAbs = path.join(pluginRoot, tmplRel);
    if (!fs.existsSync(tmplAbs)) {
      errors.push(`Missing template: ${tmplRel}`);
      continue;
    }
    const docErrs = validateDocAgainstTemplate(
      content,
      fs.readFileSync(tmplAbs, "utf8")
    );
    for (const e of docErrs) errors.push(`${rel}: ${e}`);
  }
  return { errors, warnings };
}

function parseArgs(argv) {
  const out = { files: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--memory-root") out.memoryRoot = argv[++i];
    else if (a === "--forge-json") out.forgeJson = argv[++i];
    else if (a === "--submodule-path") out.submodulePath = argv[++i];
    else if (a === "--file") out.files.push(argv[++i]);
    else if (a === "--check-doc") out.checkDoc = argv[++i];
    else if (a === "--template") out.template = argv[++i];
    else if (a === "--require-board") out.requireBoard = true;
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  let errors = [];
  let warnings = [];

  if (args.checkDoc && args.template) {
    errors = validateDocAgainstTemplate(
      fs.readFileSync(args.checkDoc, "utf8"),
      fs.readFileSync(args.template, "utf8")
    );
  } else if (args.forgeJson) {
    const obj = JSON.parse(fs.readFileSync(args.forgeJson, "utf8"));
    errors = validateForgeJson(obj, args.submodulePath, {
      requireBoard: args.requireBoard,
    });
  } else if (args.memoryRoot) {
    const result = validateMemoryRoot(args.memoryRoot, {
      files: args.files.length ? args.files : undefined,
      submodulePath: args.submodulePath,
      requireBoard: args.requireBoard,
    });
    errors = result.errors;
    warnings = result.warnings;
  } else {
    console.error(
      "Usage: validate-memory.js --memory-root DIR | --forge-json FILE | --check-doc FILE --template FILE"
    );
    process.exit(2);
  }

  const result = { ok: errors.length === 0, errors, warnings };
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}

export {
  SCHEMA_DOC_MAP,
  isSchemaDoc,
  validateSchemaDoc,
  parseProductBrief,
  validateProductBrief,
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
