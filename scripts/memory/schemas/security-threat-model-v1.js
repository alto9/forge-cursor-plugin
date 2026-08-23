/**
 * security.threat_model schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "security.threat_model",
  defaultPath: "security/threat-model.md",
  stringFields: [],
  stringArrayFields: ["assets", "trust_boundaries", "threats", "mitigations", "open_questions"],
  legacyHeadings: [
    "# Assets",
    "# Trust boundaries",
    "# Threats",
    "# Mitigations",
    "# Open questions",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseSecurityThreatModel = schema.parse;
export const validateSecurityThreatModel = schema.validate;
