import assert from "node:assert/strict";
import test from "node:test";
import dataset from "../data/military/generated/official-specialty-master.json" with { type: "json" };

test("bundled official specialty fallback has valid identities", () => {
  assert.ok(Array.isArray(dataset.records));
  assert.ok(dataset.records.length > 0);
  const identities = new Set(dataset.records.map((record) => `${record.branch}:${record.specialtyCode || record.officialName}`));
  assert.equal(identities.size, dataset.records.length);
});

test("bundled official specialty fallback has required presentation fields", () => {
  for (const record of dataset.records) {
    assert.equal(typeof record.officialName, "string");
    assert.ok(record.officialName.trim());
    assert.equal(typeof record.branch, "string");
    assert.ok(Array.isArray(record.recruitmentCategories));
  }
});
