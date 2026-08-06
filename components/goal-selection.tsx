"use client";

import { BookOpen, BriefcaseBusiness, Code2, Dumbbell, GraduationCap, Languages, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useTestSession } from "@/components/test-session-provider";
import type { UserGoal } from "@/lib/recommendation-types";

const goals: { id: UserGoal; title: string; description: string; icon: typeof BookOpen }[] = [
  { id: "certification", title: "자격증 준비", description: "공부 루틴을 이어가고 싶어요.", icon: BookOpen },
  { id: "transfer", title: "취업·편입 준비", description: "다음 커리어를 차근차근 준비해요.", icon: BriefcaseBusiness },
  { id: "english", title: "영어·어학 공부", description: "언어 공부 시간을 챙기고 싶어요.", icon: Languages },
  { id: "fitness", title: "운동·체력 향상", description: "더 단단한 체력을 만들고 싶어요.", icon: Dumbbell },
  { id: "development", title: "코딩·개발 공부", description: "기술 감각을 더 키우고 싶어요.", icon: Code2 },
  { id: "major", title: "전공 경험 활용", description: "내 전공과 연결되는 경험이 좋아요.", icon: GraduationCap },
  { id: "comfortable", title: "비교적 안정적인 생활", description: "일정과 개인 시간을 중요하게 봐요.", icon: ShieldCheck },
];

export function GoalSelection() {
  const router = useRouter();
  const { session, chooseGoal, ready } = useTestSession();
  if (!ready) return <main className="min-h-screen bg-stone-50" />;
  return <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950 sm:px-8"><div className="mx-auto max-w-3xl"><p className="text-lg font-bold">특급꿀벌</p><section className="mt-12"><p className="text-sm font-semibold text-emerald-700">마지막 한 가지</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">군 생활에서<br />제일 챙기고 싶은 건?</h1><p className="mt-4 text-stone-600">하나만 골라줘요. 이 목표를 결과에 조금 더 반영할게요.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{goals.map(({ id, title, description, icon: Icon }) => { const selected = session.selectedGoal === id; return <button aria-pressed={selected} className={`min-h-28 rounded-2xl border p-5 text-left transition focus-visible:ring-3 focus-visible:ring-emerald-200 ${selected ? "border-emerald-700 bg-emerald-50" : "border-stone-200 bg-white hover:border-emerald-400"}`} key={id} onClick={() => chooseGoal(id)} type="button"><Icon className="size-5 text-emerald-700" /><h2 className="mt-3 font-bold">{title}</h2><p className="mt-1 text-sm text-stone-600">{description}</p></button>; })}</div><Button className="mt-8 h-12 bg-emerald-700 px-6 hover:bg-emerald-800" disabled={!session.selectedGoal} onClick={() => router.push("/analyzing")} type="button">내 결과 분석하기</Button></section></div></main>;
}
