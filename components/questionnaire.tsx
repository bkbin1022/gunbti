"use client";

import { ArrowLeft, LoaderCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTestSession } from "@/components/test-session-provider";
import { responseLabels, testQuestions } from "@/data/questions";

export function Questionnaire() {
  const router = useRouter();
  const { session, ready, answer, reset } = useTestSession();
  const [index, setIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const restored = useRef(false);
  const question = testQuestions[index];
  const answered = Object.keys(session.answers).length;

  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const firstUnanswered = testQuestions.findIndex((item) => !session.answers[item.id]);
    if (firstUnanswered > -1) window.requestAnimationFrame(() => setIndex(firstUnanswered));
  }, [ready, session.answers]);

  function select(value: number, element: HTMLButtonElement) {
    if (isSubmitting) return;
    element.blur();
    answer(question.id, value);
    if (index !== testQuestions.length - 1) { setIndex((current) => current + 1); return; }
    setIsSubmitting(true);
    window.setTimeout(() => router.push("/goal"), 80);
  }

  if (!ready) return <main className="min-h-screen bg-stone-50" />;
  return <main className="min-h-screen bg-stone-50 px-5 py-6 text-stone-950 sm:px-8"><div className="mx-auto max-w-2xl"><header className="flex items-center justify-between"><Link className="text-lg font-bold tracking-tight" href="/">특급꿀벌</Link><button className="text-sm text-stone-500 hover:text-stone-800" onClick={reset} type="button"><RotateCcw className="mr-1 inline size-3.5" />처음부터</button></header>
    <section aria-busy={isSubmitting} aria-labelledby="question-title" className="mt-12 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10"><div className="flex items-center justify-between text-sm font-medium text-stone-500"><span>질문 {index + 1} / {testQuestions.length}</span><span>{answered}개 완료</span></div><div aria-label={`설문 진행률 ${Math.round(((index + 1) / testQuestions.length) * 100)}%`} className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${((index + 1) / testQuestions.length) * 100}%` }} /></div>
      <div key={question.id}><p className="mt-12 text-sm font-semibold text-emerald-700">딱 떠오르는 쪽을 골라줘요</p><h1 className="mt-3 text-2xl font-bold leading-9 sm:text-3xl" id="question-title">{question.question}</h1><p className="mt-3 text-sm text-stone-500">선택하면 바로 다음 질문으로 넘어가요.</p><div className="mt-8 grid gap-3">{responseLabels.map((label, optionIndex) => { const value = optionIndex + 1; const selected = session.answers[question.id] === value; return <button aria-pressed={selected} className={`flex min-h-14 items-center justify-between rounded-2xl border px-5 py-4 text-left text-base font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-200 bg-white hover:border-emerald-400"}`} disabled={isSubmitting} key={`${question.id}-${value}`} onClick={(event) => select(value, event.currentTarget)} type="button"><span><span className={`mr-3 text-sm ${selected ? "text-emerald-100" : "text-stone-500"}`}>{value}</span>{label}</span><span className={`text-sm font-semibold ${selected ? "text-emerald-100" : "text-emerald-700"}`}>{selected ? "선택됨" : "선택"}</span></button>; })}</div></div>
      <div aria-live="polite" className="mt-8 min-h-6 text-sm text-emerald-700">{isSubmitting && <span className="inline-flex items-center gap-2"><LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />응답을 저장하고 있어요…</span>}</div><div className="mt-2"><Button className="h-11" disabled={index === 0 || isSubmitting} onClick={() => setIndex((current) => current - 1)} type="button" variant="outline"><ArrowLeft /> 이전 질문</Button></div>
    </section></div></main>;
}
