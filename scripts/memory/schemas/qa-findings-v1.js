/**
 * qa.findings schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "qa.findings",
  defaultPath: "qa/findings.md",
  stringFields: [],
  stringArrayFields: ["open", "needs_product_call", "blockers"],
  legacyHeadings: [
    "# Open",
    "# Needs product call",
    "# Blockers",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseQaFindings = schema.parse;
export const validateQaFindings = schema.validate;
