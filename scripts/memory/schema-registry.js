/**
 * Pluggable memory doc schema registry.
 * Schema docs skip heading-template validation.
 */
import {
  parseProductBrief,
  validateProductBrief,
  DOC_ID as BRIEF_DOC_ID,
  SCHEMA_VERSION as BRIEF_SCHEMA_VERSION,
} from "./schemas/product-brief-v1.js";
import {
  validateProductRoadmap,
  DOC_ID as ROADMAP_DOC_ID,
  SCHEMA_VERSION as ROADMAP_SCHEMA_VERSION,
} from "./schemas/product-roadmap-v1.js";
import {
  validateProductBacklog,
  DOC_ID as BACKLOG_DOC_ID,
  SCHEMA_VERSION as BACKLOG_SCHEMA_VERSION,
} from "./schemas/product-backlog-v1.js";
import {
  validateProductMetrics,
  DOC_ID as METRICS_DOC_ID,
  SCHEMA_VERSION as METRICS_SCHEMA_VERSION,
} from "./schemas/product-metrics-v1.js";
import {
  validateProductInsights,
  DOC_ID as INSIGHTS_DOC_ID,
  SCHEMA_VERSION as INSIGHTS_SCHEMA_VERSION,
} from "./schemas/product-insights-v1.js";
import {
  validateProductCompetitive,
  DOC_ID as COMPETITIVE_DOC_ID,
  SCHEMA_VERSION as COMPETITIVE_SCHEMA_VERSION,
} from "./schemas/product-competitive-v1.js";
import {
  validateProductPersonas,
  DOC_ID as PERSONAS_DOC_ID,
  SCHEMA_VERSION as PERSONAS_SCHEMA_VERSION,
} from "./schemas/product-personas-v1.js";
import {
  validateProductExperiments,
  DOC_ID as EXPERIMENTS_DOC_ID,
  SCHEMA_VERSION as EXPERIMENTS_SCHEMA_VERSION,
} from "./schemas/product-experiments-v1.js";
import {
  validateProductSpec,
  DOC_ID as SPEC_DOC_ID,
  SCHEMA_VERSION as SPEC_SCHEMA_VERSION,
} from "./schemas/product-spec-v1.js";

/** Exact memory-relative path -> schema handler */
export const SCHEMA_DOC_MAP = {
  "product/brief.md": {
    doc: BRIEF_DOC_ID,
    versions: { [BRIEF_SCHEMA_VERSION]: validateProductBrief },
  },
  "product/roadmap.md": {
    doc: ROADMAP_DOC_ID,
    versions: { [ROADMAP_SCHEMA_VERSION]: validateProductRoadmap },
  },
  "product/backlog.md": {
    doc: BACKLOG_DOC_ID,
    versions: { [BACKLOG_SCHEMA_VERSION]: validateProductBacklog },
  },
  "product/metrics.md": {
    doc: METRICS_DOC_ID,
    versions: { [METRICS_SCHEMA_VERSION]: validateProductMetrics },
  },
  "product/insights.md": {
    doc: INSIGHTS_DOC_ID,
    versions: { [INSIGHTS_SCHEMA_VERSION]: validateProductInsights },
  },
  "product/competitive.md": {
    doc: COMPETITIVE_DOC_ID,
    versions: { [COMPETITIVE_SCHEMA_VERSION]: validateProductCompetitive },
  },
  "product/personas.md": {
    doc: PERSONAS_DOC_ID,
    versions: { [PERSONAS_SCHEMA_VERSION]: validateProductPersonas },
  },
  "product/experiments.md": {
    doc: EXPERIMENTS_DOC_ID,
    versions: { [EXPERIMENTS_SCHEMA_VERSION]: validateProductExperiments },
  },
};

const SPEC_ENTRY = {
  doc: SPEC_DOC_ID,
  versions: { [SPEC_SCHEMA_VERSION]: validateProductSpec },
};

/**
 * @param {string} relPath
 * @returns {{ doc: string, versions: Record<number, Function> }|null}
 */
export function schemaEntryForPath(relPath) {
  if (SCHEMA_DOC_MAP[relPath]) return SCHEMA_DOC_MAP[relPath];
  if (relPath.startsWith("product/specs/") && relPath.endsWith(".md")) {
    return SPEC_ENTRY;
  }
  return null;
}

/**
 * @param {string} relPath
 * @param {string} content
 * @returns {{ errors: string[], warnings: string[], parsed: object|null }}
 */
export function validateSchemaDoc(relPath, content) {
  const entry = schemaEntryForPath(relPath);
  if (!entry) {
    return {
      errors: [`No schema registered for ${relPath}`],
      warnings: [],
      parsed: null,
    };
  }

  const versionMatch = content.match(
    /^---\r?\n[\s\S]*?^schema_version:\s*(\d+)\s*$/m
  );
  if (versionMatch) {
    const ver = Number(versionMatch[1]);
    if (!entry.versions[ver]) {
      return {
        errors: [
          `${relPath}: unsupported schema_version ${ver} for ${entry.doc} (supported: ${Object.keys(entry.versions).join(", ")})`,
        ],
        warnings: [],
        parsed: null,
      };
    }
    return entry.versions[ver](content, relPath);
  }

  const defaultVer = Math.max(...Object.keys(entry.versions).map(Number));
  return entry.versions[defaultVer](content, relPath);
}

export function isSchemaDoc(relPath) {
  return Boolean(schemaEntryForPath(relPath));
}

export {
  parseProductBrief,
  validateProductBrief,
  validateProductRoadmap,
  validateProductBacklog,
  validateProductMetrics,
  validateProductInsights,
  validateProductCompetitive,
  validateProductPersonas,
  validateProductExperiments,
  validateProductSpec,
};
