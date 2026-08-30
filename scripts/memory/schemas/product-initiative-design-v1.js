/**
 * product.initiative_design schema_version 1 — Designer HLD notes
 * (initiatives/<slug>/design.md).
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.initiative_design",
  defaultPath: "initiatives/<slug>/design.md",
  stringFields: ["figma_file", "summary"],
  stringArrayFields: ["screens", "states", "a11y", "open_questions"],
  legacyHeadings: [
    "# Summary",
    "# Screens",
    "# States",
    "# Accessibility",
    "# Open questions",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductInitiativeDesign = schema.parse;
export const validateProductInitiativeDesign = schema.validate;
