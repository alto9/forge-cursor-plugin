/**
 * security.findings schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "security.findings",
  defaultPath: "security/findings.md",
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
export const parseSecurityFindings = schema.parse;
export const validateSecurityFindings = schema.validate;
