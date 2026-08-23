/**
 * product.brief schema_version 1 — frontmatter SoT + expansion-only body.
 */
import {
  BODY_SOFT_MAX,
  createProductDocSchema,
  isNonEmptyString,
} from "../schema-common.js";

export { BODY_SOFT_MAX };

const schema = createProductDocSchema({
  docId: "product.brief",
  defaultPath: "product/brief.md",
  stringFields: ["product", "problem", "current_focus"],
  stringArrayFields: ["audience", "goals", "non_goals"],
  metricTargetFields: ["success_metrics"],
  legacyHeadings: [
    "# Goals",
    "# Non-goals",
    "# Success metrics",
    "# Who it's for",
  ],
  extraValidate(data, _errors, warnings) {
    const weakFields = ["product", "problem", "current_focus"].filter(
      (k) => !isNonEmptyString(data[k])
    );
    if (weakFields.length) {
      warnings.push(
        `weak brief: empty ${weakFields.join(", ")} (fill before meaningful product work)`
      );
      return;
    }
    const hasGoal =
      Array.isArray(data.goals) && data.goals.some((g) => isNonEmptyString(g));
    if (!hasGoal) {
      warnings.push(
        "brief not strong: add at least one non-empty goals entry"
      );
    }
  },
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;

export function parseProductBrief(markdown, relPath) {
  return schema.parse(markdown, relPath);
}

export function validateProductBrief(markdown, relPath) {
  return schema.validate(markdown, relPath);
}
