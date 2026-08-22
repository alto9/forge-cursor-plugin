/**
 * Split markdown into YAML frontmatter + body narrative.
 */
import YAML from "yaml";

/**
 * @param {string} markdown
 * @returns {{ data: object|null, narrative: string, errors: string[] }}
 */
export function parseFrontmatter(markdown) {
  const errors = [];
  const text = markdown ?? "";
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    errors.push("Missing or invalid YAML frontmatter fence (--- ... ---)");
    return { data: null, narrative: text.trim(), errors };
  }

  let data;
  try {
    data = YAML.parse(match[1]);
  } catch (e) {
    errors.push(`YAML parse error: ${e.message}`);
    return { data: null, narrative: (match[2] ?? "").trim(), errors };
  }

  if (data == null || typeof data !== "object" || Array.isArray(data)) {
    errors.push("Frontmatter must be a YAML mapping/object");
    return { data: null, narrative: (match[2] ?? "").trim(), errors };
  }

  return { data, narrative: (match[2] ?? "").trim(), errors };
}
