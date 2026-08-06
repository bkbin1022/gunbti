"use client";

import { useMemo, useState } from "react";
import { competitionLabel } from "@/lib/competition-utils";

export function CompetitionCalculator() {
  const [capacity, setCapacity] = useState("");
  const [applicants, setApplicants] = useState("");
  const result = useMemo(() => { const places = Number(capacity); const people = Number(applicants); return Number.isFinite(places) && Number.isFinite(people) && places > 0 && people >= 0 ? { ratio: people / places, difference: people - places } : null; }, [capacity, applicants]);
  return <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950"><div className="mx-auto max-w-xl"><h1 className="text-3xl font-bold">경쟁률 계산기</h1><p className="mt-3 leading-6 text-stone-600">모집인원과 지원자 수로 참고용 경쟁률을 계산합니다. 합격 가능성을 예측하지는 않습니다.</p><div className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-sm"><label className="grid gap-2 font-medium">모집인원<input className="h-11 rounded-xl border border-stone-300 px-3" inputMode="numeric" min="1" onChange={(event) => setCapacity(event.target.value)} type="number" value={capacity} /></label><label className="grid gap-2 font-medium">지원자 수<input className="h-11 rounded-xl border border-stone-300 px-3" inputMode="numeric" min="0" onChange={(event) => setApplicants(event.target.value)} type="number" value={applicants} /></label>{result ? <section className="rounded-2xl bg-emerald-50 p-5"><p className="text-sm font-semibold text-emerald-800">참고 경쟁률</p><p className="mt-1 text-3xl font-bold">{result.ratio.toFixed(2)} : 1</p><p className="mt-2 text-sm text-emerald-950">{competitionLabel(result.ratio)} · 모집인원 대비 {result.difference >= 0 ? `${result.difference}명 많음` : `${Math.abs(result.difference)}명 적음`}</p></section> : <p className="rounded-2xl bg-stone-100 p-4 text-sm text-stone-600">모집인원은 1명 이상, 지원자 수는 0명 이상으로 입력해 주세요.</p>}<p className="text-xs leading-5 text-stone-500">경쟁률은 모집인원과 지원자 수의 비율만 보여주는 참고 지표입니다. 자격·면접·선발 기준·지원자 구성에 따라 실제 결과는 달라집니다.</p></div></div></main>;
}
