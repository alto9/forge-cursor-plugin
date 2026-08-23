/**
 * architecture.interfaces schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "architecture.interfaces",
  defaultPath: "architecture/interfaces.md",
  stringFields: [],
  stringArrayFields: ["external_interfaces", "internal_boundaries", "contracts_in_flight", "ownership"],
  legacyHeadings: [
    "# External interfaces",
    "# Internal boundaries",
    "# Contracts in flight",
    "# Ownership",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseArchitectureInterfaces = schema.parse;
export const validateArchitectureInterfaces = schema.validate;
