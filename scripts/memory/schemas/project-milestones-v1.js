/**
 * project.milestones schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "project.milestones",
  defaultPath: "project/milestones.md",
  stringFields: [],
  stringArrayFields: ["active", "upcoming", "slipped"],
  legacyHeadings: [
    "# Active",
    "# Upcoming",
    "# Slipped",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProjectMilestones = schema.parse;
export const validateProjectMilestones = schema.validate;
