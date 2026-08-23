/**
 * architecture.decisions schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "architecture.decisions",
  defaultPath: "architecture/decisions.md",
  stringFields: [],
  stringArrayFields: ["active_decisions", "superseded"],
  legacyHeadings: [
    "# Active decisions",
    "# Superseded",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseArchitectureDecisions = schema.parse;
export const validateArchitectureDecisions = schema.validate;
