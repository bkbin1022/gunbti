export const traitKeys = [
  "conscientiousness", "physical", "leadership", "computer", "mechanical",
  "outdoor", "stressTolerance", "repetitiveWork", "personalTime", "selfDevelopment",
] as const;

export type TraitKey = (typeof traitKeys)[number];
export type TraitProfile = Record<TraitKey, number>;

export type UserGoal =
  | "certification" | "transfer" | "english" | "fitness"
  | "development" | "major" | "comfortable";

export type MilitaryBranch = "army" | "navy" | "airForce" | "marineCorps";

export interface MilitaryJob {
  id: string;
  slug: string;
  name: string;
  branch: MilitaryBranch;
  category: string;
  shortDescription: string;
  overview: string;
  traits: TraitProfile;
  goalFit: Record<UserGoal, number>;
  strengths: string[];
  weaknesses: string[];
  preparation: string[];
  tags: string[];
  workEnvironment: { indoorLevel: number; physicalDemand: number; scheduleRegularity: number; teamworkLevel: number; concentrationLevel: number };
  selfDevelopment: { estimatedOpportunity: "low" | "medium" | "high"; suitableGoals: UserGoal[]; notes: string };
  dailyRoutine: { title: string; description: string }[];
  relatedMajors: string[];
  relatedCertificates: string[];
  frequentlyAskedQuestions: { question: string; answer: string }[];
  relatedJobSlugs: string[];
  officialSpecialtySlugs: string[];
  updatedAt: string;
  sources?: { label: string; url?: string }[];
}

export interface JobRecommendation {
  job: MilitaryJob;
  matchScore: number;
  reasons: string[];
  cautions: string[];
}

export interface TestSession {
  answers: Record<string, number>;
  traitProfile: TraitProfile | null;
  selectedGoal: UserGoal | null;
  recommendations: JobRecommendation[];
  completedAt?: string;
}

export const emptyTraitProfile = (): TraitProfile => ({
  conscientiousness: 3, physical: 3, leadership: 3, computer: 3, mechanical: 3,
  outdoor: 3, stressTolerance: 3, repetitiveWork: 3, personalTime: 3, selfDevelopment: 3,
});
