"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTestSession } from "@/components/test-session-provider";
import { responseLabels, testQuestions } from "@/data/questions";

export function Questionnaire() {
  const router = useRouter();
  const { session, ready, answer, reset } = useTestSession();
  const [index, setIndex] = useState(0);
  const question = testQuestions[index];
  const answered = Object.keys(session.answers).length;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const firstUnanswered = testQuestions.findIndex((item) => !session.answers[item.id]);
      if (firstUnanswered > -1) setIndex(firstUnanswered);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ready, session.answers]);

  function select(value: number) {
    answer(question.id, value);
    if (index === testQuestions.length - 1) router.push("/goal");
    else setIndex((current) => current + 1);
  }

  if (!ready) return <main className="min-h-screen bg-stone-50" />;

  return <main className="min-h-screen bg-stone-50 px-5 py-6 text-stone-950 sm:px-8"><div className="mx-auto max-w-2xl">
    <header className="flex items-center justify-between"><Link className="text-lg font-bold tracking-tight" href="/">특급꿀벌</Link><button className="text-sm text-stone-500 hover:text-stone-800" onClick={reset} type="button"><RotateCcw className="mr-1 inline size-3.5" />처음부터</button></header>
    <section aria-labelledby="question-title" className="mt-12 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center justify-between text-sm font-medium text-stone-500"><span>질문 {index + 1} / {testQuestions.length}</span><span>{answered}개 완료</span></div>
      <div aria-label={`설문 진행률 ${Math.round(((index + 1) / testQuestions.length) * 100)}%`} className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${((index + 1) / testQuestions.length) * 100}%` }} /></div>
      <p className="mt-12 text-sm font-semibold text-emerald-700">딱 떠오르는 쪽을 골라줘요</p>
      <h1 className="mt-3 text-2xl font-bold leading-9 sm:text-3xl" id="question-title">{question.question}</h1>
      <p className="mt-3 text-sm text-stone-500">선택하면 바로 다음 질문으로 넘어가요.</p>
      <div className="mt-8 grid gap-3">{responseLabels.map((label, optionIndex) => { const value = optionIndex + 1; const active = session.answers[question.id] === value; return <button aria-pressed={active} className={`flex min-h-14 items-center justify-between rounded-2xl border px-5 py-4 text-left text-base font-medium transition focus-visible:ring-3 focus-visible:ring-emerald-200 ${active ? "border-emerald-700 bg-emerald-50" : "border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/60"}`} key={label} onClick={() => select(value)} type="button"><span><span className="mr-3 text-sm text-stone-500">{value}</span>{label}</span><span className="text-sm font-semibold text-emerald-700">선택</span></button>; })}</div>
      <div className="mt-10"><Button className="h-11" disabled={index === 0} onClick={() => setIndex((current) => current - 1)} type="button" variant="outline"><ArrowLeft /> 이전 질문</Button></div>
    </section>
  </div></main>;
}
