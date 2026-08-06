export type DataFreshness = "fresh" | "aging" | "stale" | "unknown";

export const getDataFreshness = (value?: string): DataFreshness => {
  if (!value || Number.isNaN(Date.parse(value))) return "unknown";
  const ageInDays = (Date.now() - Date.parse(value)) / (1000 * 60 * 60 * 24);
  if (ageInDays <= 30) return "fresh";
  if (ageInDays <= 90) return "aging";
  return "stale";
};

export const freshnessLabel: Record<DataFreshness, string> = {
  fresh: "공식 정보 확인됨",
  aging: "공식 정보 재확인 권장",
  stale: "공식 정보 재확인 필요",
  unknown: "공식 정보 확인 필요",
};
