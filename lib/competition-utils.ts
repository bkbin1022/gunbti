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
