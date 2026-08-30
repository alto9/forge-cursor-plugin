/**
 * product.initiative schema_version 1 — initiatives/<slug>/initiative.md
 */
import { createProductDocSchema } from "../schema-common.js";

const STATUSES = new Set(["intake", "hld", "lld", "executing", "shipped"]);
const SIGNOFF_VALUES = new Set([true, false, "na"]);

const schema = createProductDocSchema({
  docId: "product.initiative",
  defaultPath: "initiatives/<slug>/initiative.md",
  stringFields: ["slug", "status", "title", "board_milestone"],
  stringArrayFields: ["board_tickets"],
  booleanFields: ["user_facing"],
  objectFields: ["signoffs"],
  legacyHeadings: ["# Summary", "# Status", "# Sign-offs"],
  extraValidate(data, errors) {
    if (typeof data.status === "string" && !STATUSES.has(data.status)) {
      errors.push(
        `status must be one of ${[...STATUSES].join("|")}, got: ${JSON.stringify(data.status)}`
      );
    }
    const so = data.signoffs;
    if (so == null || typeof so !== "object" || Array.isArray(so)) return;
    for (const role of ["po", "architect", "designer", "security"]) {
      if (!(role in so)) {
        errors.push(`signoffs.${role} is required`);
        continue;
      }
      const v = so[role];
      if (!SIGNOFF_VALUES.has(v)) {
        errors.push(
          `signoffs.${role} must be true, false, or "na", got: ${JSON.stringify(v)}`
        );
      }
    }
  },
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductInitiative = schema.parse;
export const validateProductInitiative = schema.validate;
