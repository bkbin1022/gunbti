import { readFile } from "node:fs/promises";
import { join } from "node:path";

const path = join(process.cwd(), "data", "military", "generated", "official-specialty-master.json");
const dataset = JSON.parse(await readFile(path, "utf8"));
const records = Array.isArray(dataset.records) ? dataset.records : [];
const errors = [];
const keys = new Set();
for (const [index, record] of records.entries()) {
  if (!record || typeof record !== "object") { errors.push(`record ${index}: not an object`); continue; }
  if (typeof record.officialName !== "string" || !record.officialName.trim()) errors.push(`record ${index}: missing officialName`);
  if (typeof record.branch !== "string" || !record.branch.trim()) errors.push(`record ${index}: missing branch`);
  const key = `${record.branch}:${record.specialtyCode || record.officialName}`;
  if (keys.has(key)) errors.push(`record ${index}: duplicate identity ${key}`);
  keys.add(key);
}
if (!records.length) errors.push("dataset has no records");
if (errors.length) { console.error(JSON.stringify({ status: "invalid", errors }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "valid", records: records.length, retrievedAt: dataset.retrievedAt }, null, 2));
