/**
 * design.components schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "design.components",
  defaultPath: "design/components.md",
  stringFields: [],
  objectArrayFields: ["components"],
  legacyHeadings: ["# Components"],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseDesignComponents = schema.parse;
export const validateDesignComponents = schema.validate;
