"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { questions } from "@/lib/questionnaire";

const storageKey = "teukgeup-honeybee-questionnaire-v1";

export function Questionnaire() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const question = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  const completedCount = useMemo(() => Object.keys(answers).length, [answers]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { answers?: Record<string, string>; currentIndex?: number };
          setAnswers(parsed.answers ?? {});
          setCurrentIndex(Math.min(parsed.currentIndex ?? 0, questions.length - 1));
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify({ answers, currentIndex }));
  }, [answers, currentIndex, ready]);

  function chooseAnswer(optionId: string) {
    const nextAnswers = { ...answers, [question.id]: optionId };
    const isLastQuestion = currentIndex === questions.length - 1;
    const nextIndex = isLastQuestion ? currentIndex : currentIndex + 1;

    window.localStorage.setItem(storageKey, JSON.stringify({ answers: nextAnswers, currentIndex: nextIndex }));
    setAnswers(nextAnswers);

    if (isLastQuestion) {
      router.push("/result");
      return;
    }
    setCurrentIndex(nextIndex);
  }

  function reset() {
    window.localStorage.removeItem(storageKey);
    setAnswers({});
    setCurrentIndex(0);
  }

  if (!ready) return <main className="min-h-screen bg-stone-50" />;

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-6 text-stone-950 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between">
          <Link className="text-lg font-bold tracking-tight" href="/">특급꿀벌</Link>
          <button className="text-sm text-stone-500 hover:text-stone-800" onClick={reset} type="button"><RotateCcw className="mr-1 inline size-3.5" />처음부터</button>
        </header>

        <section aria-labelledby="question-title" className="mt-12 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-center justify-between text-sm font-medium text-stone-500">
            <span>질문 {currentIndex + 1} / {questions.length}</span>
            <span>{completedCount}개 완료</span>
          </div>
          <div aria-label={`설문 진행률 ${progress}%`} className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} /></div>

          <p className="mt-12 text-sm font-semibold text-emerald-700">생각 오래 안 해도 돼요</p>
          <h1 className="mt-3 text-2xl font-bold leading-9 sm:text-3xl" id="question-title">{question.prompt}</h1>
          <p className="mt-3 text-sm text-stone-500">{question.helper} 고르면 바로 다음으로 넘어가요.</p>

          <div className="mt-8 grid gap-3">
            {question.options.map((option) => (
              <button aria-label={`${option.label} 선택`} className="flex min-h-20 items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 text-left text-base font-medium transition hover:border-emerald-400 hover:bg-emerald-50/60 focus-visible:border-emerald-600 focus-visible:ring-3 focus-visible:ring-emerald-200" key={option.id} onClick={() => chooseAnswer(option.id)} type="button">
                <span>{option.label}</span>
                <span className="text-sm font-semibold text-emerald-700">선택</span>
              </button>
            ))}
          </div>

          <div className="mt-10">
            <Button className="h-11" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => index - 1)} type="button" variant="outline"><ArrowLeft /> 이전 질문</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
