/**
 * design.tokens schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "design.tokens",
  defaultPath: "design/tokens.md",
  stringFields: [],
  stringArrayFields: [
    "color",
    "typography",
    "spacing",
    "radius",
    "elevation",
    "gaps",
  ],
  legacyHeadings: [
    "# Color",
    "# Typography",
    "# Spacing",
    "# Radius",
    "# Elevation",
    "# Gaps",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseDesignTokens = schema.parse;
export const validateDesignTokens = schema.validate;
