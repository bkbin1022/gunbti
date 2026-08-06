import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const endpoint = "https://apis.data.go.kr/1300000/gsTgMastr/list/gsTgMastr/list";
const root = join(process.cwd(), "data", "military");
const snapshotDirectory = join(root, "snapshots");
const rawDirectory = join(root, "raw");
const reviewDirectory = join(process.cwd(), "data", "review");
const generatedDirectory = join(root, "generated");
const activeSnapshotPath = join(snapshotDirectory, "active.json");
const lockPath = join(snapshotDirectory, ".sync-lock");
const isDryRun = process.argv.includes("--dry-run");
const requestTimeoutMs = Number(process.env.MMA_REQUEST_TIMEOUT_MS || 20_000);
const maximumAttempts = Number(process.env.MMA_MAX_ATTEMPTS || 4);
const rawServiceKey = process.env.MILITARY_KEY;
const serviceKey = rawServiceKey ? decodeURIComponent(rawServiceKey) : "";
const branchMap = new Map([["육군", "army"], ["해군", "navy"], ["공군", "airForce"], ["해병", "marineCorps"], ["ARMY", "army"], ["NAVY", "navy"], ["AIR FORCE", "airForce"], ["MARINE CORPS", "marineCorps"]]);
const branchLabels = { army: "육군", navy: "해군", airForce: "공군", marineCorps: "해병" };
const confirmedMappings = new Map([
  ["army:151.101", "army-intelligence"], ["army:171.101", "army-communications"], ["army:171.104", "army-communications"], ["army:171.105", "army-communications"], ["army:152.101", "army-electronics"], ["army:111292", "army-instructor"], ["army:311.101", "army-administration"], ["army:321.101", "army-military-police"], ["airForce:50", "air-transport"], ["airForce:21", "air-info-comms"], ["airForce:57", "air-info-comms"], ["navy:25", "navy-communications"], ["navy:11.05", "navy-cook"], ["marineCorps:32.01", "marine-logistics"]
]);

function hash(value) { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
function isRecord(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function text(value) { const normalized = typeof value === "string" || typeof value === "number" ? String(value).replace(/\s+/g, " ").trim() : ""; return normalized || undefined; }
function array(value) { return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value]; }
function emptyRequirements() { return { physical: [], vision: [], license: [], education: [], interview: [], other: [] }; }
function normalizeBranch(value, warnings) {
  const key = text(value)?.toUpperCase();
  const branch = key ? branchMap.get(key) : undefined;
  if (!branch) warnings.push("UNKNOWN_BRANCH:" + (text(value) || "empty"));
  return branch;
}
function readValue(record, ...keys) { for (const key of keys) { const value = text(record[key]); if (value) return value; } return undefined; }
function normalizeRecord(item, fetchedAt) {
  if (!isRecord(item)) return { record: null, warning: "INVALID_ITEM_NOT_OBJECT" };
  const warnings = [];
  const branch = normalizeBranch(item.gunGbnm ?? item.gunGbcd, warnings);
  const officialName = readValue(item, "gsteukgiNm");
  const specialtyCode = readValue(item, "gsteukgiCd");
  if (!branch || !officialName) return { record: null, warning: warnings.concat(!officialName ? ["MISSING_OFFICIAL_NAME"] : []).join(",") || "INVALID_ITEM" };
  const recruitmentCategory = readValue(item, "mjgubNm", "mjbgteukgiNm");
  const recruitmentCode = readValue(item, "mjgbCd", "mjbgteukgiCd");
  const recruitmentYearText = readValue(item, "mojipYy");
  const recruitmentYear = recruitmentYearText && /^\d{4}$/.test(recruitmentYearText) ? Number(recruitmentYearText) : undefined;
  if (recruitmentYearText && !recruitmentYear) warnings.push("INVALID_RECRUITMENT_YEAR");
  return { record: {
    sourceRecordId: `${branch}:${specialtyCode || officialName}`,
    branch,
    officialName,
    specialtyCode,
    recruitmentCategory,
    recruitmentCode,
    currentRecruitmentStatus: "unknown",
    officialSummary: undefined,
    relatedMajors: [],
    relatedLicenses: [],
    requirements: emptyRequirements(),
    recruitmentRound: readValue(item, "mojipTms"),
    recruitmentYear,
    sourceUrl: endpoint,
    fetchedAt,
    sourceUpdatedAt: undefined,
    normalizationWarnings: warnings,
    observedRecruitmentCount: 1,
  }, warning: null };
}
function recruitmentStatus(startAt, endAt, now = Date.now()) {
  const start = startAt ? Date.parse(startAt) : Number.NaN;
  const end = endAt ? Date.parse(endAt) : Number.NaN;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "unknown";
  if (now < start) return "upcoming";
  if (now > end) return "closed";
  if (end - now <= 3 * 24 * 60 * 60 * 1000) return "closingSoon";
  return "open";
}
function normalizeRecruitment(item, fetchedAt) {
  if (!isRecord(item)) return null;
  const warnings = [];
  const branch = normalizeBranch(item.gunGbnm ?? item.gunGbcd, warnings);
  const specialtyName = readValue(item, "gsteukgiNm");
  if (!branch || !specialtyName) return null;
  const specialtyCode = readValue(item, "gsteukgiCd");
  const applicationStartAt = readValue(item, "jeopsuSjdtm");
  const applicationEndAt = readValue(item, "jeopsuJrdtm");
  const enlistmentMonth = readValue(item, "iyyjsijakYm");
  const year = Number(readValue(item, "mojipYy") || 0) || undefined;
  const round = readValue(item, "mojipTms");
  const sourceId = readValue(item, "mjiljeongNo", "mbteukgiNo") || `${branch}:${specialtyCode || specialtyName}:${year || "unknown"}:${round || "unknown"}`;
  return { id: `mma-recruitment-${sourceId}-${specialtyCode || specialtyName}`, recruitmentId: sourceId, branch, specialtyId: confirmedMappings.get(`${branch}:${specialtyCode || specialtyName}`), officialSpecialtyCode: specialtyCode, specialtyName, recruitmentCategory: readValue(item, "mjgubNm", "mjbgteukgiNm") || "미표기", applicationYear: year, applicationRound: round, applicationStartAt, applicationEndAt, enlistmentMonth, capacity: undefined, applicantCount: undefined, competitionRatio: undefined, status: recruitmentStatus(applicationStartAt, applicationEndAt), officialSourceId: "MMA_OPENAPI_0004", sourceUrl: endpoint, fetchedAt, normalizationWarnings: warnings };
}
function compatibleMaster(snapshot) {
  return {
    sourceVersion: "MMA_OPENAPI_0004",
    retrievedAt: snapshot.sourceFetchedAt,
    rawRecruitmentRecordCount: snapshot.recordCount,
    specialtyCount: snapshot.officialRecords.length,
    records: snapshot.officialRecords.map((record) => ({
      id: `mma-${record.sourceRecordId}`,
      specialtyCode: record.specialtyCode,
      officialName: record.officialName,
      branch: branchLabels[record.branch],
      recruitmentCategories: record.recruitmentCategory ? [record.recruitmentCategory] : [],
      recruitmentCodes: record.recruitmentCode ? [record.recruitmentCode] : [],
      observedRecruitmentCount: record.observedRecruitmentCount,
      source: { authority: "official", label: "병무청 군사특기마스터 OpenAPI", endpoint, retrievedAt: snapshot.sourceFetchedAt },
    })),
  };
}
function compatibleRecruitments(snapshot) {
  return { sourceVersion: "MMA_OPENAPI_0004", retrievedAt: snapshot.sourceFetchedAt, records: snapshot.recruitmentRecords };
}
async function pause(milliseconds) { await new Promise((resolve) => setTimeout(resolve, milliseconds)); }
async function fetchPage(pageNo) {
  let finalError;
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      const url = new URL(endpoint);
      url.search = new URLSearchParams({ ServiceKey: serviceKey, numOfRows: "100", pageNo: String(pageNo), type: "json" }).toString();
      const response = await fetch(url, { signal: AbortSignal.timeout(requestTimeoutMs) });
      if (response.status === 401 || response.status === 403) throw new Error("API_AUTHENTICATION");
      if (response.status === 429) throw new Error("API_RATE_LIMIT");
      if (!response.ok) throw new Error(response.status >= 500 ? "API_SERVER_ERROR" : "API_HTTP_" + response.status);
      const payload = await response.json();
      if (!isRecord(payload)) throw new Error("API_SCHEMA_CHANGED");
      const body = isRecord(payload.response) && isRecord(payload.response.body) ? payload.response.body : isRecord(payload.body) ? payload.body : payload;
      const header = isRecord(payload.response) && isRecord(payload.response.header) ? payload.response.header : isRecord(payload.header) ? payload.header : undefined;
      if (header && text(header.resultCode) && text(header.resultCode) !== "00") throw new Error("API_PROVIDER_ERROR");
      const itemsContainer = isRecord(body.items) ? body.items : {};
      const items = array(itemsContainer.item ?? body.items).filter(isRecord);
      const totalCount = Number(text(body.totalCount ?? payload.totalCount) || 0);
      if (!Number.isFinite(totalCount) || totalCount < 0) throw new Error("API_SCHEMA_CHANGED");
      return { payload, items, totalCount };
    } catch (error) {
      finalError = error;
      const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      const retriable = ["API_RATE_LIMIT", "API_SERVER_ERROR"].includes(code) || code.startsWith("API_HTTP_5") || code === "fetch failed" || code === "The operation was aborted due to timeout";
      if (!retriable || attempt === maximumAttempts) break;
      await pause(500 * (2 ** (attempt - 1)));
    }
  }
  const message = finalError instanceof Error ? finalError.message : "UNKNOWN_ERROR";
  throw new Error(message === "fetch failed" ? "API_TIMEOUT" : message);
}
async function getActiveSnapshot() { try { return JSON.parse(await readFile(activeSnapshotPath, "utf8")); } catch { return null; } }
async function writeJsonAtomic(path, value) { const temporary = `${path}.${randomUUID()}.tmp`; await writeFile(temporary, JSON.stringify(value, null, 2) + "\n", "utf8"); await rename(temporary, path); }
async function acquireLock() {
  await mkdir(snapshotDirectory, { recursive: true });
  try { const age = Date.now() - (await stat(lockPath)).mtimeMs; if (age > 15 * 60 * 1000) await rm(lockPath, { force: true }); else return false; } catch { /* lock does not exist */ }
  await writeFile(lockPath, JSON.stringify({ startedAt: new Date().toISOString() }), "utf8");
  return true;
}
function diffSnapshots(previous, next) {
  const before = new Map((previous?.officialRecords || []).map((record) => [record.sourceRecordId, record]));
  const after = new Map(next.officialRecords.map((record) => [record.sourceRecordId, record]));
  const changes = [];
  for (const [id, record] of after) {
    const prior = before.get(id);
    if (!prior) changes.push({ sourceRecordId: id, branch: record.branch, changeType: "added", severity: "informational", requiresManualReview: false });
    else {
      const previousComparable = { ...prior };
      const nextComparable = { ...record };
      delete previousComparable.fetchedAt;
      delete nextComparable.fetchedAt;
      if (hash(previousComparable) !== hash(nextComparable)) changes.push({ sourceRecordId: id, branch: record.branch, changeType: "contentChanged", severity: "review", requiresManualReview: true });
    }
  }
  for (const [id, record] of before) if (!after.has(id)) changes.push({ sourceRecordId: id, branch: record.branch, changeType: "removed", severity: "critical", requiresManualReview: true });
  return changes;
}

if (!serviceKey) throw new Error("MILITARY_KEY is required. Add it to .env.local and retry.");
const startedAt = new Date().toISOString();
if (!(await acquireLock())) {
  console.log(JSON.stringify({ status: "alreadyRunning", startedAt, errorCode: "SYNC_ALREADY_RUNNING" }, null, 2));
  process.exit(0);
}
try {
  const first = await fetchPage(1);
  if (first.totalCount === 0) throw new Error("UNEXPECTED_ZERO_RECORDS");
  const pageCount = Math.ceil(first.totalCount / 100);
  const rawItems = [...first.items];
  for (let page = 2; page <= pageCount; page += 1) rawItems.push(...(await fetchPage(page)).items);
  if (!rawItems.length) throw new Error("UNEXPECTED_ZERO_RECORDS");
  const fetchedAt = new Date().toISOString();
  const invalidRecords = [];
  const deduplicated = new Map();
  for (const item of rawItems) {
    const normalized = normalizeRecord(item, fetchedAt);
    if (!normalized.record) { invalidRecords.push(normalized.warning); continue; }
    const existing = deduplicated.get(normalized.record.sourceRecordId);
    if (existing) { existing.observedRecruitmentCount += 1; continue; }
    deduplicated.set(normalized.record.sourceRecordId, normalized.record);
  }
  const officialRecords = [...deduplicated.values()].sort((left, right) => left.branch.localeCompare(right.branch) || left.officialName.localeCompare(right.officialName, "ko-KR"));
  if (!officialRecords.length) throw new Error("NO_VALID_RECORDS");
  const recruitmentRecords = rawItems.map((item) => normalizeRecruitment(item, fetchedAt)).filter(Boolean);
  const unmatched = officialRecords.filter((record) => !confirmedMappings.has(record.sourceRecordId));
  const snapshot = {
    id: `mma-${fetchedAt.replace(/[:.]/g, "-")}`,
    schemaVersion: "1.0.0",
    dataVersion: `official-${fetchedAt.slice(0, 10)}`,
    createdAt: new Date().toISOString(),
    sourceFetchedAt: fetchedAt,
    recordCount: rawItems.length,
    validRecordCount: officialRecords.length,
    invalidRecordCount: invalidRecords.length,
    matchedRecordCount: officialRecords.length - unmatched.length,
    unmatchedRecordCount: unmatched.length,
    officialRecords,
    recruitmentRecords,
    warnings: invalidRecords,
    sourceHash: hash(rawItems),
  };
  const previous = await getActiveSnapshot();
  const changes = diffSnapshots(previous, snapshot);
  const result = { status: previous?.sourceHash === snapshot.sourceHash ? "noChanges" : invalidRecords.length ? "partialSuccess" : "success", startedAt, completedAt: new Date().toISOString(), fetchedRecords: rawItems.length, validRecords: officialRecords.length, invalidRecords: invalidRecords.length, matchedRecords: snapshot.matchedRecordCount, unmatchedRecords: unmatched.length, addedRecords: changes.filter((change) => change.changeType === "added").length, updatedRecords: changes.filter((change) => change.changeType === "contentChanged").length, removedRecords: changes.filter((change) => change.changeType === "removed").length, unchangedRecords: previous ? Math.max(0, officialRecords.length - changes.length) : 0, warnings: invalidRecords, errors: [], snapshotId: snapshot.id };
  if (!isDryRun) {
    await Promise.all([mkdir(rawDirectory, { recursive: true }), mkdir(reviewDirectory, { recursive: true }), mkdir(generatedDirectory, { recursive: true })]);
    const needsSchemaUpgrade = !previous || !Array.isArray(previous.recruitmentRecords);
    if (result.status !== "noChanges" || needsSchemaUpgrade) {
      await writeJsonAtomic(join(rawDirectory, `${snapshot.id}.json`), { provider: "MMA_OPENAPI_0004", endpoint, fetchedAt, payload: rawItems, payloadHash: snapshot.sourceHash });
      await writeJsonAtomic(join(snapshotDirectory, `${snapshot.id}.json`), { ...snapshot, changes });
      await writeJsonAtomic(activeSnapshotPath, { ...snapshot, changes });
      await writeJsonAtomic(join(reviewDirectory, "unmatched-specialties.json"), unmatched.map((record) => ({ sourceRecordId: record.sourceRecordId, branch: record.branch, officialName: record.officialName, specialtyCode: record.specialtyCode, candidateInternalIds: [], status: "unreviewed" })));
    }
    await writeJsonAtomic(join(generatedDirectory, "official-specialty-master.json"), compatibleMaster(snapshot));
    await writeJsonAtomic(join(generatedDirectory, "recruitments.json"), compatibleRecruitments(snapshot));
  }
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  console.error(JSON.stringify({ status: "failed", startedAt, completedAt: new Date().toISOString(), errorCode: code }, null, 2));
  process.exitCode = 1;
} finally {
  await rm(lockPath, { force: true });
}
