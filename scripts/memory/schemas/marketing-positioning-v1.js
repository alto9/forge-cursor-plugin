/**
 * marketing.positioning schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "marketing.positioning",
  defaultPath: "marketing/positioning.md",
  stringFields: ["audience", "problem", "promise", "differentiator"],
  stringArrayFields: ["proof", "non_positioning"],
  legacyHeadings: [
    "# Audience",
    "# Problem",
    "# Promise",
    "# Differentiator",
    "# Proof",
    "# Non-positioning",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseMarketingPositioning = schema.parse;
export const validateMarketingPositioning = schema.validate;
