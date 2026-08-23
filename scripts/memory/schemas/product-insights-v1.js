/**
 * product.insights schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.insights",
  defaultPath: "product/insights.md",
  stringArrayFields: ["themes", "open_questions", "evidence", "implications"],
  legacyHeadings: [
    "# Themes",
    "# Open questions",
    "# Evidence",
    "# Implications",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductInsights = schema.parse;
export const validateProductInsights = schema.validate;
