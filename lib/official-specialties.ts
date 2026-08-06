import officialMaster from "@/data/military/generated/official-specialty-master.json";

export type OfficialBranch = "육군" | "해군" | "공군" | "해병";

export interface OfficialSpecialty {
  id: string;
  slug: string;
  name: string;
  branch: OfficialBranch;
  specialtyCode?: string;
  recruitmentCategories: string[];
  recruitmentCodes: string[];
  observedRecruitmentCount: number;
  source: {
    label: string;
    endpoint: string;
    retrievedAt: string;
  };
}

const branchSlugs: Record<OfficialBranch, string> = {
  육군: "army",
  해군: "navy",
  공군: "air-force",
  해병: "marine-corps",
};

const toSlugPart = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "specialty";

export const officialSpecialties: OfficialSpecialty[] = officialMaster.records.map((record) => {
  const branch = record.branch as OfficialBranch;
  const codeOrName = record.specialtyCode || record.officialName;

  return {
    id: `${branch}:${codeOrName}`,
    slug: `${branchSlugs[branch]}-${toSlugPart(codeOrName)}`,
    name: record.officialName,
    branch,
    specialtyCode: record.specialtyCode,
    recruitmentCategories: record.recruitmentCategories,
    recruitmentCodes: record.recruitmentCodes,
    observedRecruitmentCount: record.observedRecruitmentCount,
    source: record.source,
  };
});

export const officialSpecialtyCounts = Object.fromEntries(
  (Object.keys(branchSlugs) as OfficialBranch[]).map((branch) => [
    branch,
    officialSpecialties.filter((specialty) => specialty.branch === branch).length,
  ]),
) as Record<OfficialBranch, number>;

export const findOfficialSpecialty = (slug: string) =>
  officialSpecialties.find((specialty) => specialty.slug === slug);
