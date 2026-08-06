import { emptyTraitProfile, type MilitaryBranch, type MilitaryJob, type TraitProfile, type UserGoal } from "@/lib/recommendation-types";

const profile = (values: Partial<TraitProfile>): TraitProfile => ({ ...emptyTraitProfile(), ...values });
const goals = (values: Partial<Record<UserGoal, number>>): Record<UserGoal, number> => ({ certification: 3, transfer: 3, english: 3, fitness: 3, development: 3, major: 3, comfortable: 3, ...values });
const job = (id: string, name: string, branch: MilitaryBranch, description: string, traits: Partial<TraitProfile>, goalFit: Partial<Record<UserGoal, number>>, tags: string[]): MilitaryJob => ({
  id, slug: id, name, branch, shortDescription: description, traits: profile(traits), goalFit: goals(goalFit), tags,
  category: tags[0], overview: `${description} 세부 역할과 근무 환경은 부대와 운영 여건에 따라 달라질 수 있습니다.`,
  strengths: tags.slice(0, 2), weaknesses: ["부대와 보직에 따라 실제 업무 환경이 달라질 수 있습니다."], preparation: ["공식 모집 공고와 지원 요건을 확인해 보세요.", "관심 분야의 기초 지식과 체력 계획을 점검해 보세요."],
  workEnvironment: { indoorLevel: 6 - (traits.outdoor ?? 3), physicalDemand: traits.physical ?? 3, scheduleRegularity: traits.repetitiveWork ?? 3, teamworkLevel: traits.leadership ?? 3, concentrationLevel: traits.conscientiousness ?? 3 },
  selfDevelopment: { estimatedOpportunity: (goalFit.development ?? 3) >= 4 ? "high" : (goalFit.comfortable ?? 3) >= 4 ? "medium" : "low", suitableGoals: (Object.entries(goals(goalFit)) as [UserGoal, number][]).filter(([, value]) => value >= 4).map(([goal]) => goal), notes: "자기계발 여건은 부대 일정과 개인 업무 상황에 따라 달라질 수 있습니다." },
  dailyRoutine: [{ title: "업무 준비", description: "당일 역할과 안전·운영 관련 사항을 확인합니다." }, { title: "주요 지원 업무", description: description }, { title: "정리와 인수인계", description: "기록을 정리하고 다음 업무를 준비합니다." }],
  relatedMajors: tags.includes("IT") || tags.includes("통신") ? ["컴퓨터공학", "전자공학"] : tags.includes("기계") || tags.includes("정비") ? ["기계공학", "자동차공학"] : ["경영", "행정"],
  relatedCertificates: ["관련 분야 기초 자격 또는 교육 이수 여부를 공식 공고에서 확인"], frequentlyAskedQuestions: [{ question: "실제 업무 환경은 항상 같은가요?", answer: "아니요. 부대, 시기, 직무 세부 배치와 운영 여건에 따라 달라질 수 있습니다." }], relatedJobSlugs: [], updatedAt: "2026-08-06",
});

export const militaryJobs: MilitaryJob[] = [
  job("army-operations", "육군 작전·상황병", "army", "상황 정보를 정리하고 팀의 작전 지원을 돕는 역할군", { conscientiousness: 5, stressTolerance: 4, computer: 3 }, { certification: 4, transfer: 4, comfortable: 4 }, ["정확성", "상황판단"]),
  job("army-intelligence", "육군 정보병", "army", "정보를 수집·정리해 의사결정 지원에 보태는 역할군", { conscientiousness: 5, computer: 4, repetitiveWork: 4 }, { certification: 4, development: 4, major: 4 }, ["분석", "집중력"]),
  job("army-communications", "육군 통신병", "army", "통신 장비와 연결 상태를 점검하고 운용을 지원하는 역할군", { computer: 4, mechanical: 4, conscientiousness: 4 }, { development: 5, major: 5, certification: 4 }, ["통신", "장비"]),
  job("army-electronics", "육군 전자·장비 정비", "army", "전자 장비의 점검과 기초 정비를 지원하는 역할군", { mechanical: 5, computer: 4, conscientiousness: 4 }, { major: 5, development: 4, certification: 4 }, ["정비", "문제해결"]),
  job("army-vehicle", "육군 차량 정비", "army", "차량과 관련 장비의 상태 확인·정비를 돕는 역할군", { mechanical: 5, physical: 4, outdoor: 3 }, { major: 5, fitness: 4, certification: 3 }, ["기계", "현장"]),
  job("army-instructor", "육군 조교", "army", "교육·훈련 현장에서 안내와 진행을 지원하는 역할군", { leadership: 5, physical: 4, outdoor: 4 }, { fitness: 5, transfer: 3, english: 3 }, ["리더십", "교육"]),
  job("army-administration", "육군 행정병", "army", "문서와 일정, 인원 관련 행정 업무를 보조하는 역할군", { conscientiousness: 5, repetitiveWork: 5, personalTime: 4 }, { certification: 5, transfer: 5, comfortable: 5 }, ["문서", "일정"]),
  job("army-military-police", "육군 군사경찰", "army", "안전과 질서 유지 관련 현장 업무를 지원하는 역할군", { physical: 5, stressTolerance: 5, leadership: 4 }, { fitness: 5, transfer: 3, comfortable: 1 }, ["안전", "대응"]),
  job("air-transport", "공군 항공운항 지원", "airForce", "항공 운항 관련 정보를 정리하고 지원하는 역할군", { conscientiousness: 5, stressTolerance: 4, computer: 4 }, { english: 5, certification: 4, transfer: 4 }, ["정확성", "항공"]),
  job("air-administration", "공군 행정", "airForce", "문서·일정·조직 운영에 필요한 행정 업무를 지원하는 역할군", { conscientiousness: 5, repetitiveWork: 5, personalTime: 4 }, { certification: 5, transfer: 5, comfortable: 5 }, ["행정", "정리"]),
  job("air-info-comms", "공군 정보통신", "airForce", "정보 시스템과 통신 환경의 운용을 돕는 역할군", { computer: 5, conscientiousness: 4, mechanical: 3 }, { development: 5, major: 5, certification: 4 }, ["IT", "통신"]),
  job("air-aircraft-maintenance", "공군 항공기 정비", "airForce", "항공 장비의 안전 점검과 정비 지원을 수행하는 역할군", { mechanical: 5, conscientiousness: 5, physical: 3 }, { major: 5, certification: 4, fitness: 3 }, ["정비", "꼼꼼함"]),
  job("air-air-defense", "공군 방공 지원", "airForce", "감시·대응 체계의 운영을 지원하는 역할군", { stressTolerance: 5, computer: 4, conscientiousness: 4 }, { fitness: 4, development: 4, english: 3 }, ["집중력", "대응"]),
  job("air-operations", "공군 작전 지원", "airForce", "작전 자료와 상황 공유를 지원하는 역할군", { computer: 4, stressTolerance: 4, leadership: 3 }, { english: 4, transfer: 4, certification: 4 }, ["분석", "상황판단"]),
  job("navy-maneuver", "해군 갑판병", "navy", "함정 내 갑판 업무와 팀 단위 현장 활동을 지원하는 역할군", { physical: 5, outdoor: 5, leadership: 3 }, { fitness: 5, comfortable: 1, transfer: 2 }, ["체력", "팀워크"]),
  job("navy-communications", "해군 통신병", "navy", "함정과 육상 간 통신 장비 운용을 지원하는 역할군", { computer: 4, mechanical: 4, conscientiousness: 4 }, { development: 5, major: 5, english: 4 }, ["통신", "장비"]),
  job("navy-machinery", "해군 기관병", "navy", "기관·기계 장비의 상태 점검과 운용을 지원하는 역할군", { mechanical: 5, physical: 4, stressTolerance: 4 }, { major: 5, fitness: 4, certification: 3 }, ["기계", "현장"]),
  job("navy-cook", "해군 조리병", "navy", "급식 운영과 조리 환경 관리를 지원하는 역할군", { repetitiveWork: 4, physical: 4, conscientiousness: 4 }, { certification: 4, transfer: 3, comfortable: 2 }, ["운영", "책임감"]),
  job("marine-communications", "해병대 통신병", "marineCorps", "현장 통신 장비의 운용과 연결을 지원하는 역할군", { physical: 4, computer: 4, stressTolerance: 4 }, { fitness: 4, development: 4, major: 4 }, ["통신", "현장"]),
  job("marine-logistics", "해병대 수송병", "marineCorps", "수송 장비와 물자 이동 관련 현장 업무를 지원하는 역할군", { physical: 5, outdoor: 4, mechanical: 3 }, { fitness: 5, major: 3, comfortable: 1 }, ["수송", "활동성"]),
];

export const branchLabels: Record<MilitaryBranch, string> = { army: "육군", navy: "해군", airForce: "공군", marineCorps: "해병대" };
