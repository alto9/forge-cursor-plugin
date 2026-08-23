/**
 * project.status schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "project.status",
  defaultPath: "project/status.md",
  stringFields: ["summary"],
  stringArrayFields: ["in_flight", "blockers", "next_up", "asks"],
  legacyHeadings: [
    "# Summary",
    "# In flight",
    "# Blockers",
    "# Next up",
    "# Asks",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProjectStatus = schema.parse;
export const validateProjectStatus = schema.validate;
