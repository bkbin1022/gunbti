export const traitLabels = {
  collaboration: "협업 성향",
  field: "현장 활동 성향",
  structure: "체계·분석 성향",
  technology: "기술·장비 성향",
} as const;

export type Trait = keyof typeof traitLabels;
export type Scores = Record<Trait, number>;

export type AnswerOption = {
  id: string;
  label: string;
  scores: Partial<Scores>;
};

export type Question = {
  id: string;
  prompt: string;
  helper: string;
  options: AnswerOption[];
};

const emptyScores: Scores = {
  collaboration: 0,
  field: 0,
  structure: 0,
  technology: 0,
};

export const questions: Question[] = [
  { id: "q1", prompt: "새로운 과제가 생기면 어떤 방식이 더 편한가요?", helper: "나와 더 가까운 쪽을 골라 주세요.", options: [
    { id: "q1-a", label: "역할을 나누고 함께 해결한다", scores: { collaboration: 2 } },
    { id: "q1-b", label: "혼자 집중해서 해결책을 만든다", scores: { collaboration: -2, structure: 1 } },
  ] },
  { id: "q2", prompt: "더 만족감을 느끼는 하루는 어떤 모습인가요?", helper: "업무 환경의 선호를 묻는 질문입니다.", options: [
    { id: "q2-a", label: "밖에서 움직이며 상황에 대응한다", scores: { field: 2 } },
    { id: "q2-b", label: "정리된 공간에서 계획을 세워 진행한다", scores: { field: -2, structure: 1 } },
  ] },
  { id: "q3", prompt: "예상 밖의 문제가 생기면 먼저 무엇을 하나요?", helper: "정답은 없습니다.", options: [
    { id: "q3-a", label: "주변 사람과 빠르게 정보를 나눈다", scores: { collaboration: 2, field: 1 } },
    { id: "q3-b", label: "원인과 순서를 차분히 분석한다", scores: { structure: 2 } },
  ] },
  { id: "q4", prompt: "어떤 도구를 다룰 때 흥미가 생기나요?", helper: "평소 관심사를 떠올려 보세요.", options: [
    { id: "q4-a", label: "장비의 원리와 작동 방식을 파고든다", scores: { technology: 2, structure: 1 } },
    { id: "q4-b", label: "사람이 쉽게 사용할 방법을 고민한다", scores: { technology: -1, collaboration: 2 } },
  ] },
  { id: "q5", prompt: "팀에서 맡고 싶은 역할은 무엇인가요?", helper: "가장 자연스럽게 느껴지는 역할을 골라 주세요.", options: [
    { id: "q5-a", label: "현장을 살피고 실행을 이끈다", scores: { field: 2, collaboration: 1 } },
    { id: "q5-b", label: "정보를 정리하고 정확도를 확인한다", scores: { structure: 2 } },
  ] },
  { id: "q6", prompt: "학습할 때 더 효과적인 방법은 무엇인가요?", helper: "익숙한 방식을 선택해 주세요.", options: [
    { id: "q6-a", label: "직접 해 보면서 몸으로 익힌다", scores: { field: 2, technology: 1 } },
    { id: "q6-b", label: "원리와 절차를 이해한 뒤 연습한다", scores: { structure: 2 } },
  ] },
  { id: "q7", prompt: "중요한 결정을 내릴 때 더 신뢰하는 것은?", helper: "둘 중 더 자주 사용하는 방식을 골라 주세요.", options: [
    { id: "q7-a", label: "함께 논의해 모은 의견", scores: { collaboration: 2 } },
    { id: "q7-b", label: "자료와 기준을 바탕으로 한 판단", scores: { structure: 2 } },
  ] },
  { id: "q8", prompt: "어떤 성취가 가장 뿌듯한가요?", helper: "나에게 동기가 되는 순간을 떠올려 보세요.", options: [
    { id: "q8-a", label: "현장에서 바로 도움이 되는 결과를 냈을 때", scores: { field: 2, collaboration: 1 } },
    { id: "q8-b", label: "복잡한 장비나 문제를 정확히 해결했을 때", scores: { technology: 2, structure: 1 } },
  ] },
  { id: "q9", prompt: "반복되는 일에서는 무엇을 더 중요하게 보나요?", helper: "업무를 개선하는 관점을 묻는 질문입니다.", options: [
    { id: "q9-a", label: "서로의 호흡과 소통을 더 좋게 만든다", scores: { collaboration: 2 } },
    { id: "q9-b", label: "오차를 줄이고 절차를 더 정확하게 만든다", scores: { structure: 2, technology: 1 } },
  ] },
  { id: "q10", prompt: "낯선 환경에 놓였을 때 어떤 행동을 하나요?", helper: "첫 반응에 가까운 선택을 골라 주세요.", options: [
    { id: "q10-a", label: "먼저 주변을 살피고 필요한 일을 찾아 움직인다", scores: { field: 2, collaboration: 1 } },
    { id: "q10-b", label: "규칙과 장비를 확인해 안전한 방법을 찾는다", scores: { structure: 1, technology: 2 } },
  ] },
];

const jobs = [
  { id: "operations", name: "작전·현장 지원", description: "현장의 흐름을 읽고 팀과 함께 빠르게 대응하는 역할군", target: { collaboration: 2, field: 2, structure: 0, technology: 0 } },
  { id: "technical", name: "정비·기술 지원", description: "장비의 원리를 이해하고 정확하게 점검·복구하는 역할군", target: { collaboration: 0, field: 0, structure: 2, technology: 2 } },
  { id: "information", name: "정보·통신 지원", description: "정보를 체계적으로 다루고 안정적인 연결을 만드는 역할군", target: { collaboration: 1, field: -1, structure: 2, technology: 2 } },
  { id: "administration", name: "행정·인사 지원", description: "절차와 사람 사이를 조율해 조직 운영을 돕는 역할군", target: { collaboration: 2, field: -1, structure: 2, technology: -1 } },
] as const;

export type Recommendation = {
  id: string;
  name: string;
  description: string;
  score: number;
  reasons: string[];
};

export function calculateScores(answers: Record<string, string>): Scores {
  return questions.reduce<Scores>((total, question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    if (!selected) return total;

    (Object.keys(traitLabels) as Trait[]).forEach((trait) => {
      total[trait] += selected.scores[trait] ?? 0;
    });
    return total;
  }, { ...emptyScores });
}

export function getRecommendations(answers: Record<string, string>): Recommendation[] {
  const scores = calculateScores(answers);
  const maxDistance = 40;

  return jobs.map((job) => {
    const distance = (Object.keys(traitLabels) as Trait[]).reduce(
      (sum, trait) => sum + Math.abs(scores[trait] - job.target[trait]),
      0,
    );
    const matchingTraits = (Object.keys(traitLabels) as Trait[])
      .filter((trait) => Math.abs(scores[trait] - job.target[trait]) <= 2)
      .sort((a, b) => Math.abs(scores[a] - job.target[a]) - Math.abs(scores[b] - job.target[b]))
      .slice(0, 2)
      .map((trait) => traitLabels[trait]);

    return {
      id: job.id,
      name: job.name,
      description: job.description,
      score: Math.max(45, Math.min(98, Math.round(100 - (distance / maxDistance) * 100))),
      reasons: matchingTraits.length ? matchingTraits : ["종합 성향"],
    };
  }).sort((a, b) => b.score - a.score).slice(0, 3);
}
