/**
 * product.backlog schema_version 1 — board projection (board wins).
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.backlog",
  defaultPath: "product/backlog.md",
  stringArrayFields: [
    "in_progress",
    "ready",
    "refinement",
    "blocked",
    "icebox",
  ],
  legacyHeadings: [
    "# In progress",
    "# Ready",
    "# Refinement",
    "# Blocked",
    "# Icebox",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductBacklog = schema.parse;
export const validateProductBacklog = schema.validate;
