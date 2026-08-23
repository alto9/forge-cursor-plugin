/**
 * security.checklist schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "security.checklist",
  defaultPath: "security/checklist.md",
  stringFields: [],
  stringArrayFields: ["secrets", "dependencies", "authn_authz", "data_handling", "config_defaults", "release_gates"],
  legacyHeadings: [
    "# Secrets",
    "# Dependencies",
    "# Authn / authz",
    "# Data handling",
    "# Config / defaults",
    "# Release gates",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseSecurityChecklist = schema.parse;
export const validateSecurityChecklist = schema.validate;
