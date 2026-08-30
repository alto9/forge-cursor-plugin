/**
 * product.initiative_spec schema_version 1 — Architect HLD technical spec
 * (initiatives/<slug>/spec.md). Distinct from per-ticket tech spec comments.
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.initiative_spec",
  defaultPath: "initiatives/<slug>/spec.md",
  stringFields: ["summary", "approach"],
  stringArrayFields: [
    "interfaces",
    "structure",
    "constraints",
    "open_questions",
  ],
  legacyHeadings: [
    "# Summary",
    "# Approach",
    "# Interfaces",
    "# Structure",
    "# Constraints",
    "# Open questions",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductInitiativeSpec = schema.parse;
export const validateProductInitiativeSpec = schema.validate;
