import recruitmentDataset from "@/data/military/generated/recruitments.json";

export type RecruitmentStatus = "upcoming" | "open" | "closingSoon" | "closed" | "beforeEnlistment" | "unknown";
export type RecruitmentBranch = "army" | "navy" | "airForce" | "marineCorps";

export interface RecruitmentCompetitionRecord {
  id: string;
  recruitmentId: string;
  branch: RecruitmentBranch;
  specialtyId?: string;
  officialSpecialtyCode?: string;
  specialtyName: string;
  recruitmentCategory: string;
  applicationYear?: number;
  applicationRound?: string;
  applicationStartAt?: string;
  applicationEndAt?: string;
  enlistmentMonth?: string;
  capacity?: number;
  applicantCount?: number;
  competitionRatio?: number;
  status: RecruitmentStatus;
  officialSourceId: string;
  sourceUrl: string;
  fetchedAt: string;
}

export const recruitmentStatusLabels: Record<RecruitmentStatus, string> = { upcoming: "접수 예정", open: "접수 중", closingSoon: "마감 임박", closed: "접수 마감", beforeEnlistment: "입영 예정", unknown: "확인 필요" };
export const recruitmentBranchLabels: Record<RecruitmentBranch, string> = { army: "육군", navy: "해군", airForce: "공군", marineCorps: "해병" };

const rawRecords = Array.isArray(recruitmentDataset.records) ? recruitmentDataset.records : [];
export const recruitmentRecords = rawRecords as RecruitmentCompetitionRecord[];
export const recruitmentLastSyncedAt = recruitmentDataset.retrievedAt || undefined;

export function calculateCompetitionRatio(capacity?: number, applicantCount?: number) {
  return capacity && capacity > 0 && applicantCount !== undefined ? applicantCount / capacity : undefined;
}

export function competitionLabel(ratio?: number) {
  if (ratio === undefined) return "경쟁률 정보 없음";
  if (ratio < 1) return "지원자 부족";
  if (ratio < 2) return "1~2:1 수준";
  if (ratio < 4) return "경쟁 있음";
  if (ratio < 7) return "경쟁 높음";
  return "매우 높음";
}

export function filterRecruitments(records: RecruitmentCompetitionRecord[], params: { branch?: string; status?: string; query?: string; currentOnly?: string }) {
  const keyword = params.query?.trim().toLowerCase();
  return records.filter((record) => {
    if (params.branch && record.branch !== params.branch) return false;
    if (params.status && record.status !== params.status) return false;
    if (params.currentOnly === "true" && !["open", "closingSoon"].includes(record.status)) return false;
    const searchable = [record.specialtyName, record.officialSpecialtyCode, record.recruitmentCategory].filter(Boolean).join(" ").toLowerCase();
    return !keyword || searchable.includes(keyword);
  });
}
