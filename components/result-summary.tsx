"use client";

import { Copy, Info, RotateCcw, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useTestSession } from "@/components/test-session-provider";
import { branchLabels } from "@/data/jobs";
import { getResultType, traitLabels } from "@/lib/recommendation";
import { traitKeys } from "@/lib/recommendation-types";

function traitBars(profile: NonNullable<ReturnType<typeof useTestSession>["session"]["traitProfile"]>) {
  return [...traitKeys].sort((a, b) => profile[b] - profile[a]).map((trait) => ({ trait, label: traitLabels[trait], value: profile[trait] }));
}

export function ResultSummary() {
  const { session, ready, reset } = useTestSession();
  const [notice, setNotice] = useState("");
  if (!ready) return <main className="min-h-screen bg-stone-50" />;
  if (!session.traitProfile || !session.recommendations.length) return <main className="grid min-h-screen place-items-center bg-stone-50 px-5 text-center"><section className="max-w-md rounded-3xl border border-stone-200 bg-white p-8"><Info className="mx-auto size-8 text-amber-500" /><h1 className="mt-4 text-2xl font-bold">결과를 찾지 못했어요</h1><p className="mt-3 text-sm leading-6 text-stone-600">설문과 목표 선택을 마치면 특급꿀벌이 결과를 보여줄게요.</p><Link className="mt-6 inline-flex h-11 items-center rounded-xl bg-emerald-700 px-4 font-medium text-white" href="/test">설문 다시 하기</Link></section></main>;
  const [primary, ...others] = session.recommendations;
  const resultType = getResultType(session.traitProfile);
  const bars = traitBars(session.traitProfile);
  const shareText = `특급꿀벌 결과: 나는 ${resultType.name}! 가장 잘 맞는 샘플 직무군은 ${primary.job.name}, 찰떡도 ${primary.matchScore}%`;
  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title: "특급꿀벌 결과", text: shareText, url: window.location.href }); return; }
      await navigator.clipboard.writeText(shareText); setNotice("결과 문구를 복사했어요.");
    } catch {
      setNotice("공유를 취소했거나 복사하지 못했어요.");
    }
  }
  async function copy() { await navigator.clipboard.writeText(shareText); setNotice("결과 문구를 복사했어요."); }
  return <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950 sm:px-8"><div className="mx-auto max-w-4xl"><header className="flex items-center justify-between"><Link className="text-lg font-bold" href="/">특급꿀벌</Link><Link className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium hover:bg-stone-200" href="/test" onClick={reset}><RotateCcw className="size-4" /> 다시 하기</Link></header>
    <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8"><p className="text-sm font-semibold text-emerald-800">당신의 특급꿀벌 타입</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{resultType.name}</h1><p className="mt-4 max-w-2xl leading-7 text-stone-700">{resultType.summary}</p><div className="mt-5 flex flex-wrap gap-2">{bars.slice(0, 3).map((item) => <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-800" key={item.trait}>{item.label} {item.value}/5</span>)}</div></section>
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]"><article className="rounded-3xl border border-stone-200 bg-white p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">꿀매칭 1위 · {branchLabels[primary.job.branch]}</p><h2 className="mt-1 text-2xl font-bold">{primary.job.name}</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">찰떡도 {primary.matchScore}%</span></div><p className="mt-4 leading-7 text-stone-600">{primary.job.shortDescription}</p><div className="mt-5 flex flex-wrap gap-2">{primary.job.tags.slice(0, 3).map((tag) => <span className="rounded-full bg-stone-100 px-3 py-1 text-sm" key={tag}>{tag}</span>)}</div><h3 className="mt-7 font-bold">이렇게 매칭했어요</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-stone-600">{primary.reasons.map((reason) => <li key={reason}>· {reason}</li>)}</ul><h3 className="mt-6 font-bold">미리 알아둘 점</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-stone-600">{primary.cautions.map((caution) => <li key={caution}>· {caution}</li>)}</ul><button className="mt-6 h-10 rounded-lg border border-stone-300 px-3 text-sm font-medium text-stone-500" disabled type="button">관심 목록에 추가 (준비 중)</button></article>
      <aside className="rounded-3xl border border-stone-200 bg-white p-6"><h2 className="font-bold">내 성향 그래프</h2><div className="mt-5 grid gap-4">{bars.map((item) => <div key={item.trait}><div className="flex justify-between text-sm"><span>{item.label}</span><span className="font-semibold">{item.value}/5</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${item.value * 20}%` }} /></div></div>)}</div></aside></section>
    <section className="mt-8"><h2 className="text-xl font-bold">다른 꿀매칭도 비교해 봐요</h2><div className="mt-4 grid gap-3">{others.map((item, index) => <article className="flex flex-col justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-5 sm:flex-row sm:items-center" key={item.job.id}><div><p className="text-sm font-semibold text-emerald-700">{index + 2}위 · {branchLabels[item.job.branch]}</p><h3 className="mt-1 font-bold">{item.job.name}</h3><p className="mt-1 text-sm text-stone-600">{item.reasons[0]}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold">{item.matchScore}%</span><span className="text-sm text-stone-500">{item.job.tags.slice(0, 2).join(" · ")}</span></div></article>)}</div></section>
    <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6"><h2 className="font-bold">친구에게 내 결과 공유하기</h2><p className="mt-2 text-sm text-stone-600">답변 원문은 공유하지 않고, 결과 요약만 복사해요.</p><div className="mt-4 flex flex-wrap gap-2"><button className="inline-flex h-11 items-center rounded-xl bg-emerald-700 px-4 text-sm font-medium text-white" onClick={share} type="button"><Share2 className="mr-2 size-4" />공유하기</button><button className="inline-flex h-11 items-center rounded-xl border border-stone-300 px-4 text-sm font-medium" onClick={copy} type="button"><Copy className="mr-2 size-4" />결과 복사</button></div>{notice && <p aria-live="polite" className="mt-3 text-sm text-emerald-700">{notice}</p>}</section>
    <p className="mt-8 rounded-2xl bg-stone-100 p-4 text-sm leading-6 text-stone-600">특급꿀벌의 추천 결과는 성향과 목표를 바탕으로 한 참고 정보예요. 실제 모집 조건, 보직 배치, 근무 환경은 군별·부대별·시기별·운영 여건에 따라 달라질 수 있으니 병무청과 각 군의 공식 모집 정보를 반드시 확인해 주세요.</p>
  </div></main>;
}
