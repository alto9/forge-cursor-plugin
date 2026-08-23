/**
 * architecture.constraints schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "architecture.constraints",
  defaultPath: "architecture/constraints.md",
  stringFields: [],
  stringArrayFields: ["hard_constraints", "soft_constraints", "out_of_bounds", "assumptions"],
  legacyHeadings: [
    "# Hard constraints",
    "# Soft constraints",
    "# Out of bounds",
    "# Assumptions",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseArchitectureConstraints = schema.parse;
export const validateArchitectureConstraints = schema.validate;
