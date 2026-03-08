#!/usr/bin/env bats
# Test init-forge skill: scaffolds .forge structure from knowledge_map.json

setup() {
  SCRIPT_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
  SKILL_SCRIPT="${PLUGIN_ROOT}/skills/init-forge/scripts/init-forge.js"
  TEST_DIR=""
}

teardown() {
  if [[ -n "${TEST_DIR}" && -d "${TEST_DIR}" ]]; then
    rm -rf "${TEST_DIR}"
  fi
}

@test "init-forge: --help exits 0" {
  run node "${SKILL_SCRIPT}" --help
  [ "$status" -eq 0 ]
  [[ "$output" == *"Usage"* ]]
  [[ "$output" == *"knowledge_map"* ]]
}

@test "init-forge: scaffolds .forge in target directory" {
  TEST_DIR="$(mktemp -d)"
  run node "${SKILL_SCRIPT}" "${TEST_DIR}"
  [ "$status" -eq 0 ]
  [ -d "${TEST_DIR}/.forge" ]
  [ -f "${TEST_DIR}/.forge/vision.json" ]
  [ -f "${TEST_DIR}/.forge/project.json" ]
  [ -f "${TEST_DIR}/.forge/roadmap.json" ]
  [ -f "${TEST_DIR}/.forge/skill_registry.json" ]
  [ -d "${TEST_DIR}/.forge/schemas" ]
}

@test "init-forge: creates domain folders" {
  TEST_DIR="$(mktemp -d)"
  run node "${SKILL_SCRIPT}" "${TEST_DIR}"
  [ "$status" -eq 0 ]
  [ -f "${TEST_DIR}/.forge/runtime/index.md" ]
  [ -f "${TEST_DIR}/.forge/business_logic/index.md" ]
  [ -f "${TEST_DIR}/.forge/data/index.md" ]
}
