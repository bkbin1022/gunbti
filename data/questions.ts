import type { TraitKey } from "@/lib/recommendation-types";

export interface TestQuestion {
  id: string;
  question: string;
  description?: string;
  trait: TraitKey;
  reverseScored?: boolean;
}

export const responseLabels = ["전혀 그렇지 않다", "그렇지 않은 편이다", "보통이다", "그런 편이다", "매우 그렇다"] as const;

export const testQuestions: TestQuestion[] = [
  { id: "q1", question: "계획을 세우고 정해진 순서대로 일을 처리하는 편이다.", trait: "conscientiousness" },
  { id: "q2", question: "반복적인 문서 작업도 실수 없이 수행할 수 있다.", trait: "repetitiveWork" },
  { id: "q3", question: "예상하지 못한 상황에서도 침착함을 유지하는 편이다.", trait: "stressTolerance" },
  { id: "q4", question: "컴퓨터나 새로운 프로그램을 배우는 것이 어렵지 않다.", trait: "computer" },
  { id: "q5", question: "기계나 장비가 작동하는 원리를 찾아보는 것을 좋아한다.", trait: "mechanical" },
  { id: "q6", question: "실내보다 실외에서 몸을 움직이는 활동을 선호한다.", trait: "outdoor" },
  { id: "q7", question: "사람들 앞에서 지휘하거나 의견을 조율하는 것이 편하다.", trait: "leadership" },
  { id: "q8", question: "체력적으로 힘든 상황에서도 쉽게 포기하지 않는 편이다.", trait: "physical" },
  { id: "q9", question: "혼자 사용할 수 있는 개인 시간이 매우 중요하다.", trait: "personalTime" },
  { id: "q10", question: "군 생활 중에도 공부나 자격증 준비를 계속하고 싶다.", trait: "selfDevelopment" },
  { id: "q11", question: "업무 내용이 자주 바뀌는 환경보다 일정한 일과가 편하다.", trait: "repetitiveWork" },
  { id: "q12", question: "작은 실수도 중요한 결과로 이어질 수 있는 업무를 맡을 수 있다.", trait: "conscientiousness" },
];
