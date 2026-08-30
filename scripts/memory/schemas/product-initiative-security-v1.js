/**
 * product.initiative_security schema_version 1 — Security HLD notes
 * (initiatives/<slug>/security.md).
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.initiative_security",
  defaultPath: "initiatives/<slug>/security.md",
  stringFields: ["summary"],
  stringArrayFields: [
    "threats",
    "mitigations",
    "requirements",
    "open_questions",
  ],
  legacyHeadings: [
    "# Summary",
    "# Threats",
    "# Mitigations",
    "# Requirements",
    "# Open questions",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductInitiativeSecurity = schema.parse;
export const validateProductInitiativeSecurity = schema.validate;
