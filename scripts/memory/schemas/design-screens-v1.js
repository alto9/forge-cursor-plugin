/**
 * design.screens schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "design.screens",
  defaultPath: "design/screens.md",
  stringFields: [],
  objectArrayFields: ["screens"],
  legacyHeadings: ["# Screens"],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseDesignScreens = schema.parse;
export const validateDesignScreens = schema.validate;
