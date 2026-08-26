/**
 * design.structure schema_version 1
 */
import { createProductDocSchema, isNonEmptyString } from "../schema-common.js";

const ALLOWED_STATUS = new Set(["unverified", "pass", "fail"]);

const schema = createProductDocSchema({
  docId: "design.structure",
  defaultPath: "design/structure.md",
  stringFields: ["structure_status", "last_checked"],
  stringArrayFields: [
    "structure_gaps",
    "required_pages_found",
    "required_variable_patterns_missing",
    "required_component_categories_missing",
  ],
  legacyHeadings: ["# Structure"],
  extraValidate(data, errors) {
    if (
      typeof data.structure_status === "string" &&
      !ALLOWED_STATUS.has(data.structure_status)
    ) {
      errors.push(
        `structure_status must be unverified|pass|fail, got: ${JSON.stringify(data.structure_status)}`
      );
    }
    // last_checked may be "" at init; otherwise ISO date (updated already checked separately)
    if (
      typeof data.last_checked === "string" &&
      data.last_checked !== "" &&
      !/^\d{4}-\d{2}-\d{2}$/.test(data.last_checked)
    ) {
      errors.push(
        `last_checked must be "" or YYYY-MM-DD, got: ${JSON.stringify(data.last_checked)}`
      );
    }
    if (
      data.structure_status === "pass" &&
      Array.isArray(data.structure_gaps) &&
      data.structure_gaps.some((g) => isNonEmptyString(g))
    ) {
      errors.push("structure_status pass requires empty structure_gaps");
    }
  },
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseDesignStructure = schema.parse;
export const validateDesignStructure = schema.validate;
