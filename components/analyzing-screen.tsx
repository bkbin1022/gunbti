"use client";

import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useTestSession } from "@/components/test-session-provider";
import { testQuestions } from "@/data/questions";

const stages = ["성향 점수 정리", "목표 가중치 반영", "직무 적합도 비교", "추천 결과 생성"];

export function AnalyzingScreen() {
  const router = useRouter();
  const { session, complete, ready } = useTestSession();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (Object.keys(session.answers).length < testQuestions.length) { router.replace("/test"); return; }
    if (!session.selectedGoal) { router.replace("/goal"); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 80 : 420;
    const timers = stages.map((_, index) => window.setTimeout(() => setStage(index), delay * index));
    const finish = window.setTimeout(() => { complete(); router.replace("/result"); }, reduced ? 200 : 1800);
    return () => { timers.forEach(window.clearTimeout); window.clearTimeout(finish); };
  }, [complete, ready, router, session.answers, session.selectedGoal]);

  return <main className="grid min-h-screen place-items-center bg-stone-50 px-5 text-stone-950"><section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm"><Sparkles className="size-6 text-emerald-700" /><p className="mt-5 text-sm font-semibold text-emerald-700">특급꿀벌이 매칭 중이에요</p><h1 className="mt-2 text-2xl font-bold">내 꿀조합 찾는 중</h1><p className="mt-3 text-sm leading-6 text-stone-600">입력한 답변과 목표를 바탕으로 샘플 직무군을 비교하고 있어요.</p><ol className="mt-8 grid gap-3">{stages.map((label, index) => <li className={`flex items-center gap-3 text-sm transition ${index <= stage ? "text-stone-950" : "text-stone-400"}`} key={label}><span className={`grid size-6 place-items-center rounded-full ${index <= stage ? "bg-emerald-700 text-white" : "bg-stone-100"}`}>{index < stage ? <Check className="size-4" /> : index + 1}</span>{label}</li>)}</ol></section></main>;
}
