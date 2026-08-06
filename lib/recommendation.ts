import { testQuestions } from "@/data/questions";
import { militaryJobs } from "@/data/jobs";
import { emptyTraitProfile, traitKeys, type JobRecommendation, type TraitKey, type TraitProfile, type UserGoal } from "@/lib/recommendation-types";
import { calculateQuestionScore } from "@/lib/test-scoring";

export const traitLabels: Record<TraitKey, string> = {
  conscientiousness: "꼼꼼함", physical: "체력", leadership: "리더십", computer: "컴퓨터 활용",
  mechanical: "기계 감각", outdoor: "야외 활동", stressTolerance: "침착함", repetitiveWork: "반복 업무",
  personalTime: "개인 시간", selfDevelopment: "자기계발",
};

export const DEFAULT_TRAIT_WEIGHTS: Record<TraitKey, number> = {
  conscientiousness: 1.2, physical: 1, leadership: 0.8, computer: 1, mechanical: 0.9,
  outdoor: 0.8, stressTolerance: 1.1, repetitiveWork: 0.8, personalTime: 1.2, selfDevelopment: 1.2,
};

const goalLabels: Record<UserGoal, string> = { certification: "자격증 준비", transfer: "취업·편입 준비", english: "영어·어학 공부", fitness: "체력 향상", development: "코딩·개발 공부", major: "전공 경험", comfortable: "비교적 안정적인 생활" };

export function calculateTraitProfile(answers: Record<string, number>): TraitProfile {
  const totals = Object.fromEntries(traitKeys.map((trait) => [trait, { sum: 0, count: 0 }])) as Record<TraitKey, { sum: number; count: number }>;
  testQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (!Number.isFinite(answer)) return;
    totals[question.trait].sum += calculateQuestionScore(answer, question.reverseScored);
    totals[question.trait].count += 1;
  });
  return traitKeys.reduce<TraitProfile>((profile, trait) => ({ ...profile, [trait]: totals[trait].count ? Math.round((totals[trait].sum / totals[trait].count) * 10) / 10 : 3 }), emptyTraitProfile());
}

function weightedTraits(goal: UserGoal | null) {
  const weights = { ...DEFAULT_TRAIT_WEIGHTS };
  const emphasize = (...traits: TraitKey[]) => traits.forEach((trait) => { weights[trait] *= 1.45; });
  if (goal === "certification") emphasize("personalTime", "conscientiousness", "selfDevelopment");
  if (goal === "transfer") emphasize("personalTime", "repetitiveWork", "selfDevelopment");
  if (goal === "english") emphasize("personalTime", "selfDevelopment", "conscientiousness");
  if (goal === "fitness") emphasize("physical", "outdoor", "stressTolerance");
  if (goal === "development") emphasize("computer", "personalTime", "selfDevelopment");
  if (goal === "major") emphasize("computer", "mechanical", "conscientiousness");
  if (goal === "comfortable") { emphasize("personalTime", "repetitiveWork"); weights.physical *= 0.65; }
  return weights;
}

function makeReasons(profile: TraitProfile, jobTraits: TraitProfile, goal: UserGoal | null) {
  const traits = [...traitKeys].sort((a, b) => Math.abs(profile[a] - jobTraits[a]) - Math.abs(profile[b] - jobTraits[b])).slice(0, 2);
  const reasons = traits.map((trait) => `${traitLabels[trait]} 성향이 이 역할군과 비교적 잘 맞아요.`);
  if (goal) reasons.push(`${goalLabels[goal]}을 중요하게 보는 목표와도 비교적 잘 맞습니다.`);
  return reasons;
}

export function getRecommendations(profile: TraitProfile | null, goal: UserGoal | null): JobRecommendation[] {
  const user = profile ?? emptyTraitProfile();
  const weights = weightedTraits(goal);
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  return militaryJobs.map((job) => {
    const traitScore = traitKeys.reduce((sum, trait) => sum + (1 - Math.abs(user[trait] - job.traits[trait]) / 4) * weights[trait], 0) / totalWeight;
    const goalScore = goal ? job.goalFit[goal] / 5 : 0.6;
    const matchScore = Math.max(55, Math.min(96, Math.round((traitScore * 0.75 + goalScore * 0.25) * 100)));
    const cautions = ["실제 모집 조건·배치·근무 환경은 군별, 부대별, 시기별로 달라질 수 있어요."];
    if (job.traits.physical >= 4) cautions.push("예상보다 체력 소모가 클 수 있으니 실제 업무 환경을 확인해 보세요.");
    else cautions.push("개인 시간과 업무 강도는 부대 운영 여건에 따라 달라질 수 있어요.");
    return { job, matchScore, reasons: makeReasons(user, job.traits, goal), cautions };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}

export function getResultType(profile: TraitProfile) {
  const strongest = [...traitKeys].sort((a, b) => profile[b] - profile[a]).slice(0, 2);
  const types: Record<string, { name: string; summary: string }> = {
    "computer-mechanical": { name: "차분한 기술 탐험가", summary: "도구와 원리를 이해하는 데 강점이 있어요. 정확한 기술 지원 역할군을 먼저 살펴보세요." },
    "physical-outdoor": { name: "현장형 에너지 리더", summary: "움직이는 환경에서 에너지를 내는 편이에요. 활동성과 팀워크가 필요한 역할군을 비교해 보세요." },
    "conscientiousness-repetitiveWork": { name: "꼼꼼한 운영 플래너", summary: "정해진 기준을 지키며 흐름을 안정적으로 만드는 성향이에요. 운영·행정 지원 역할군과 잘 맞을 수 있어요." },
    "stressTolerance-leadership": { name: "침착한 상황 리더", summary: "예상 밖 상황에서도 중심을 잡는 편이에요. 상황 대응과 협업이 필요한 역할군을 살펴보세요." },
  };
  const key = strongest.join("-");
  return types[key] ?? { name: "균형 잡힌 멀티 플레이어", summary: "여러 성향이 고르게 드러났어요. 목표와 생활 선호를 함께 고려해 결과를 비교해 보세요." };
}
