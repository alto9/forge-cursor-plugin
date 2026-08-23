/**
 * architecture.overview schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "architecture.overview",
  defaultPath: "architecture/overview.md",
  stringFields: ["system", "context", "data_flow", "deployment_shape", "current_focus"],
  stringArrayFields: ["major_components"],
  legacyHeadings: [
    "# System",
    "# Context",
    "# Major components",
    "# Data flow",
    "# Deployment shape",
    "# Current focus",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseArchitectureOverview = schema.parse;
export const validateArchitectureOverview = schema.validate;
