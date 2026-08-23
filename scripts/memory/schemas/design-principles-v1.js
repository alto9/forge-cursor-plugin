/**
 * design.principles schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "design.principles",
  defaultPath: "design/principles.md",
  stringFields: [],
  stringArrayFields: [
    "principles",
    "a11y_rules",
    "interaction_patterns",
    "anti_patterns",
  ],
  legacyHeadings: [
    "# Principles",
    "# Accessibility rules",
    "# Interaction patterns",
    "# Anti-patterns",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseDesignPrinciples = schema.parse;
export const validateDesignPrinciples = schema.validate;
