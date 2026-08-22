/**
 * product.brief schema_version 1 — frontmatter SoT + expansion-only body.
 */
import { parseFrontmatter } from "../parse-frontmatter.js";

export const DOC_ID = "product.brief";
export const SCHEMA_VERSION = 1;
export const BODY_SOFT_MAX = 6000;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FORBIDDEN_HEADING =
  /^#{1,6}[ \t]+.*(changelog|history|decision\s+log).*$/gim;
const DATED_LOG_HEADING = /^#{2,3}[ \t]+\d{4}-\d{2}/gm;
const LEGACY_BODY_HEADINGS = [
  "# Goals",
  "# Non-goals",
  "# Success metrics",
  "# Who it's for",
];

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isStringArray(v) {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/**
 * @param {string} markdown
 * @param {string} [relPath]
 * @returns {{
 *   errors: string[],
 *   warnings: string[],
 *   parsed: {
 *     meta: { doc: string, schema_version: number, updated: string, path: string },
 *     core: object,
 *     narrative: string
 *   }|null
 * }}
 */
export function parseProductBrief(markdown, relPath = "product/brief.md") {
  const errors = [];
  const warnings = [];
  const { data, narrative, errors: parseErrors } = parseFrontmatter(markdown);
  errors.push(...parseErrors);
  if (!data) {
    return { errors, warnings, parsed: null };
  }

  if (data.doc !== DOC_ID) {
    errors.push(`doc must be "${DOC_ID}", got: ${JSON.stringify(data.doc)}`);
  }
  if (data.schema_version !== SCHEMA_VERSION) {
    errors.push(
      `schema_version must be ${SCHEMA_VERSION}, got: ${JSON.stringify(data.schema_version)}`
    );
  }
  if (typeof data.updated !== "string" || !ISO_DATE.test(data.updated)) {
    errors.push(
      `updated must be ISO date YYYY-MM-DD, got: ${JSON.stringify(data.updated)}`
    );
  }

  for (const key of ["product", "problem", "current_focus"]) {
    if (typeof data[key] !== "string") {
      errors.push(`${key} must be a string`);
    }
  }
  for (const key of ["audience", "goals", "non_goals"]) {
    if (!isStringArray(data[key])) {
      errors.push(`${key} must be an array of strings`);
    }
  }

  if (!Array.isArray(data.success_metrics)) {
    errors.push("success_metrics must be an array");
  } else {
    data.success_metrics.forEach((item, i) => {
      if (item == null || typeof item !== "object" || Array.isArray(item)) {
        errors.push(`success_metrics[${i}] must be an object with metric and target`);
        return;
      }
      if (typeof item.metric !== "string") {
        errors.push(`success_metrics[${i}].metric must be a string`);
      }
      if (typeof item.target !== "string") {
        errors.push(`success_metrics[${i}].target must be a string`);
      }
    });
  }

  // Forbidden body patterns
  if (FORBIDDEN_HEADING.test(narrative)) {
    errors.push(
      "Body must not contain changelog, history, or decision log headings"
    );
  }
  FORBIDDEN_HEADING.lastIndex = 0;
  if (DATED_LOG_HEADING.test(narrative)) {
    errors.push("Body must not contain dated log headings (## YYYY-MM-...)");
  }
  DATED_LOG_HEADING.lastIndex = 0;

  if (errors.length) {
    return { errors, warnings, parsed: null };
  }

  // Readiness warnings
  const weakFields = ["product", "problem", "current_focus"].filter(
    (k) => !isNonEmptyString(data[k])
  );
  if (weakFields.length) {
    warnings.push(
      `weak brief: empty ${weakFields.join(", ")} (fill before meaningful product work)`
    );
  } else {
    const hasGoal =
      Array.isArray(data.goals) && data.goals.some((g) => isNonEmptyString(g));
    if (!hasGoal) {
      warnings.push(
        "brief not strong: add at least one non-empty goals entry"
      );
    }
  }

  if (narrative.length > BODY_SOFT_MAX) {
    warnings.push(
      `body length ${narrative.length} exceeds soft max ${BODY_SOFT_MAX}`
    );
  }

  for (const h of LEGACY_BODY_HEADINGS) {
    if (narrative.includes(h)) {
      warnings.push(
        `body contains legacy heading "${h}" — move content into frontmatter`
      );
    }
  }

  const parsed = {
    meta: {
      doc: data.doc,
      schema_version: data.schema_version,
      updated: data.updated,
      path: relPath,
    },
    core: {
      product: data.product,
      problem: data.problem,
      audience: data.audience,
      goals: data.goals,
      non_goals: data.non_goals,
      success_metrics: data.success_metrics,
      current_focus: data.current_focus,
    },
    narrative,
  };

  return { errors, warnings, parsed };
}

/**
 * @param {string} markdown
 * @param {string} [relPath]
 * @returns {{ errors: string[], warnings: string[], parsed: object|null }}
 */
export function validateProductBrief(markdown, relPath) {
  return parseProductBrief(markdown, relPath);
}
