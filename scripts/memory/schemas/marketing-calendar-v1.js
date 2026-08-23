/**
 * marketing.calendar schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "marketing.calendar",
  defaultPath: "marketing/calendar.md",
  stringFields: [],
  stringArrayFields: ["themes", "this_period", "upcoming_hooks", "channels"],
  legacyHeadings: [
    "# Themes",
    "# This period",
    "# Upcoming hooks",
    "# Channels",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseMarketingCalendar = schema.parse;
export const validateMarketingCalendar = schema.validate;
