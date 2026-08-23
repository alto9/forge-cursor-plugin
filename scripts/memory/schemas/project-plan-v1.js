/**
 * project.plan schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "project.plan",
  defaultPath: "project/plan.md",
  stringFields: ["objective"],
  stringArrayFields: ["in_scope", "sequence", "dependencies", "handoffs"],
  legacyHeadings: [
    "# Objective",
    "# In scope",
    "# Sequence",
    "# Dependencies",
    "# Handoffs",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProjectPlan = schema.parse;
export const validateProjectPlan = schema.validate;
