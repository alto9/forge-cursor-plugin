/**
 * product.personas schema_version 1 — detail (brief.audience = short segments).
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.personas",
  defaultPath: "product/personas.md",
  stringArrayFields: ["primary", "jobs_to_be_done", "not_for"],
  legacyHeadings: ["# Primary", "# Jobs to be done", "# Not for"],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductPersonas = schema.parse;
export const validateProductPersonas = schema.validate;
