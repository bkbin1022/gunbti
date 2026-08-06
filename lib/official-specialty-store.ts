import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { officialSpecialties, type OfficialBranch, type OfficialSpecialty } from "@/lib/official-specialties";

const branchSlugs: Record<OfficialBranch, string> = { 육군: "army", 해군: "navy", 공군: "air-force", 해병: "marine-corps" };
const labels: Record<string, OfficialBranch> = { army: "육군", navy: "해군", airForce: "공군", marineCorps: "해병" };
const activePath = join(process.cwd(), "data", "military", "snapshots", "active.json");
const slugPart = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "specialty";

function asActiveSpecialties(value: unknown): OfficialSpecialty[] | null {
  if (!value || typeof value !== "object" || !Array.isArray((value as { officialRecords?: unknown }).officialRecords)) return null;
  const records = (value as { officialRecords: unknown[] }).officialRecords;
  const specialties = records.flatMap((record) => {
    if (!record || typeof record !== "object") return [];
    const item = record as Record<string, unknown>;
    const branch = typeof item.branch === "string" ? labels[item.branch] : undefined;
    const name = typeof item.officialName === "string" ? item.officialName : undefined;
    const code = typeof item.specialtyCode === "string" ? item.specialtyCode : undefined;
    if (!branch || !name) return [];
    const codeOrName = code || name;
    return [{ id: typeof item.sourceRecordId === "string" ? item.sourceRecordId : `${branch}:${codeOrName}`, slug: `${branchSlugs[branch]}-${slugPart(codeOrName)}`, name, branch, specialtyCode: code, recruitmentCategories: typeof item.recruitmentCategory === "string" ? [item.recruitmentCategory] : [], recruitmentCodes: typeof item.recruitmentCode === "string" ? [item.recruitmentCode] : [], observedRecruitmentCount: typeof item.observedRecruitmentCount === "number" ? item.observedRecruitmentCount : 1, source: { label: "병무청 군사특기마스터 OpenAPI", endpoint: typeof item.sourceUrl === "string" ? item.sourceUrl : "", retrievedAt: typeof item.fetchedAt === "string" ? item.fetchedAt : "" } }];
  });
  return specialties.length ? specialties : null;
}

export async function getActiveOfficialSpecialties(): Promise<OfficialSpecialty[]> {
  try { return asActiveSpecialties(JSON.parse(await readFile(activePath, "utf8"))) || officialSpecialties; } catch { return officialSpecialties; }
}

export async function findActiveOfficialSpecialty(slug: string) {
  return (await getActiveOfficialSpecialties()).find((specialty) => specialty.slug === slug);
}
