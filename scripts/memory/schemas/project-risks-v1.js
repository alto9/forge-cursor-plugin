/**
 * project.risks schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "project.risks",
  defaultPath: "project/risks.md",
  stringFields: [],
  stringArrayFields: ["risks", "issues", "dependencies", "assumptions"],
  legacyHeadings: [
    "# Risks",
    "# Issues",
    "# Dependencies",
    "# Assumptions",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProjectRisks = schema.parse;
export const validateProjectRisks = schema.validate;
