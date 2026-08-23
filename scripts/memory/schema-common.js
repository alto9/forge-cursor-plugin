/**
 * Shared helpers for memory doc frontmatter schemas.
 */
import { parseFrontmatter } from "./parse-frontmatter.js";

export const BODY_SOFT_MAX = 6000;
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
export const FORBIDDEN_HEADING =
  /^#{1,6}[ \t]+.*(changelog|history|decision\s+log).*$/gim;
export const DATED_LOG_HEADING = /^#{2,3}[ \t]+\d{4}-\d{2}/gm;

export function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export function isStringArray(v) {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/**
 * @param {unknown} arr
 * @param {string} field
 * @param {string[]} errors
 */
export function validateMetricTargetArray(arr, field, errors) {
  if (!Array.isArray(arr)) {
    errors.push(`${field} must be an array`);
    return;
  }
  arr.forEach((item, i) => {
    if (item == null || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`${field}[${i}] must be an object with metric and target`);
      return;
    }
    if (typeof item.metric !== "string") {
      errors.push(`${field}[${i}].metric must be a string`);
    }
    if (typeof item.target !== "string") {
      errors.push(`${field}[${i}].target must be a string`);
    }
  });
}

/**
 * @param {string} narrative
 * @param {string[]} errors
 */
export function validateForbiddenBody(narrative, errors) {
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
}

/**
 * @param {string} narrative
 * @param {string[]} legacyHeadings
 * @param {string[]} warnings
 */
export function warnLegacyHeadings(narrative, legacyHeadings, warnings) {
  for (const h of legacyHeadings) {
    if (narrative.includes(h)) {
      warnings.push(
        `body contains legacy heading "${h}" — move content into frontmatter`
      );
    }
  }
}

/**
 * @param {string} narrative
 * @param {string[]} warnings
 */
export function warnBodySoftMax(narrative, warnings) {
  if (narrative.length > BODY_SOFT_MAX) {
    warnings.push(
      `body length ${narrative.length} exceeds soft max ${BODY_SOFT_MAX}`
    );
  }
}

/**
 * Build a product.* frontmatter schema validator.
 *
 * @param {{
 *   docId: string,
 *   defaultPath: string,
 *   stringFields?: string[],
 *   stringArrayFields?: string[],
 *   metricTargetFields?: string[],
 *   legacyHeadings?: string[],
 *   extraValidate?: (data: object, errors: string[], warnings: string[]) => void,
 * }} opts
 */
export function createProductDocSchema(opts) {
  const {
    docId,
    defaultPath,
    stringFields = [],
    stringArrayFields = [],
    metricTargetFields = [],
    legacyHeadings = [],
    extraValidate,
  } = opts;
  const SCHEMA_VERSION = 1;
  const coreKeys = [
    ...stringFields,
    ...stringArrayFields,
    ...metricTargetFields,
  ];

  function parse(markdown, relPath = defaultPath) {
    const errors = [];
    const warnings = [];
    const { data, narrative, errors: parseErrors } = parseFrontmatter(markdown);
    errors.push(...parseErrors);
    if (!data) {
      return { errors, warnings, parsed: null };
    }

    if (data.doc !== docId) {
      errors.push(`doc must be "${docId}", got: ${JSON.stringify(data.doc)}`);
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

    for (const key of stringFields) {
      if (typeof data[key] !== "string") {
        errors.push(`${key} must be a string`);
      }
    }
    for (const key of stringArrayFields) {
      if (!isStringArray(data[key])) {
        errors.push(`${key} must be an array of strings`);
      }
    }
    for (const key of metricTargetFields) {
      validateMetricTargetArray(data[key], key, errors);
    }

    validateForbiddenBody(narrative, errors);

    if (typeof extraValidate === "function") {
      extraValidate(data, errors, warnings);
    }

    if (errors.length) {
      return { errors, warnings, parsed: null };
    }

    warnBodySoftMax(narrative, warnings);
    warnLegacyHeadings(narrative, legacyHeadings, warnings);

    const core = {};
    for (const key of coreKeys) core[key] = data[key];

    return {
      errors,
      warnings,
      parsed: {
        meta: {
          doc: data.doc,
          schema_version: data.schema_version,
          updated: data.updated,
          path: relPath,
        },
        core,
        narrative,
      },
    };
  }

  return {
    DOC_ID: docId,
    SCHEMA_VERSION,
    parse,
    validate: parse,
  };
}
