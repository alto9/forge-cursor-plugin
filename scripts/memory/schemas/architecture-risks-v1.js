/**
 * architecture.risks schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "architecture.risks",
  defaultPath: "architecture/risks.md",
  stringFields: [],
  stringArrayFields: ["structural_risks", "coupling_hotspots", "migration_hazards", "watch_list"],
  legacyHeadings: [
    "# Structural risks",
    "# Coupling hotspots",
    "# Migration hazards",
    "# Watch list",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseArchitectureRisks = schema.parse;
export const validateArchitectureRisks = schema.validate;
