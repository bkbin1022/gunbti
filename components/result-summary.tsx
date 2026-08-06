"use client";

import { ArrowRight, CircleAlert, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getRecommendations, type Recommendation } from "@/lib/questionnaire";

const storageKey = "teukgeup-honeybee-questionnaire-v1";

export function ResultSummary() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved) as { answers?: Record<string, string> };
        if (parsed.answers && Object.keys(parsed.answers).length) setRecommendations(getRecommendations(parsed.answers));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function restart() {
    window.localStorage.removeItem(storageKey);
  }

  if (recommendations === null) {
    return <main className="grid min-h-screen place-items-center bg-stone-50 px-5 text-center"><section className="max-w-md rounded-3xl border border-stone-200 bg-white p-8"><CircleAlert className="mx-auto size-8 text-amber-500" /><h1 className="mt-4 text-2xl font-bold">앗, 결과가 안 보여요</h1><p className="mt-3 text-sm leading-6 text-stone-600">이 기기에 저장된 답변을 찾지 못했어요. 한 번 더 가볍게 해볼까요?</p><Link className="mt-6 inline-flex h-10 items-center rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800" href="/test">내 꿀보직 찾기 <ArrowRight className="ml-2 size-4" /></Link></section></main>;
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between"><Link className="text-lg font-bold tracking-tight" href="/">특급꿀벌</Link><Link className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium hover:bg-stone-200" href="/test" onClick={restart}><RotateCcw className="size-4" /> 다시 찾기</Link></header>
        <section className="mt-12"><p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><Sparkles className="size-4" /> 당신만의 꿀 조합</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">내 성향에 제일<br />찰떡인 직무군이에요.</h1><p className="mt-4 max-w-xl leading-7 text-stone-600">답변을 바탕으로 가볍게 매칭했어요. 실제 보직과 자격은 공식 안내를 따로 확인해 주세요.</p></section>
        <section className="mt-10 grid gap-4" aria-label="추천 직무군">
          {recommendations.map((recommendation, index) => <article className={`rounded-3xl border p-6 ${index === 0 ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-white"}`} key={recommendation.id}><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">꿀매칭 {index + 1}</p><h2 className="mt-1 text-xl font-bold">{recommendation.name}</h2></div><span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-emerald-800 shadow-sm">찰떡도 {recommendation.score}%</span></div><p className="mt-4 text-sm leading-6 text-stone-600">{recommendation.description}</p><p className="mt-4 text-sm"><span className="font-semibold">왜 잘 맞냐면: </span>{recommendation.reasons.join(" · ")}이 잘 맞아요.</p></article>)}
        </section>
        <p className="mt-8 rounded-2xl bg-stone-100 p-4 text-sm leading-6 text-stone-600">이 결과는 성향 탐색용 참고 자료예요. 군의 공식 선발·배치 기준이나 개인별 자격을 대신하지 않습니다.</p>
      </div>
    </main>
  );
}
