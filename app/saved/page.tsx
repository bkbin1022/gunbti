"use client";

import Link from "next/link";
import { useSavedSpecialties } from "@/components/saved-specialties-provider";
import { officialSpecialties } from "@/lib/official-specialties";

export default function SavedPage() {
  const { saved, toggle } = useSavedSpecialties();
  const specialties = saved.flatMap((item) => { const specialty = officialSpecialties.find((candidate) => candidate.id === item.specialtyId); return specialty ? [{ ...specialty, savedAt: item.savedAt }] : []; });
  return <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950"><div className="mx-auto max-w-3xl"><nav className="text-sm text-stone-500"><Link href="/">홈</Link> · 저장한 특기</nav><h1 className="mt-8 text-3xl font-bold">저장한 특기</h1><p className="mt-3 text-sm leading-6 text-stone-600">이 목록은 현재 기기 브라우저에만 저장됩니다. 다른 기기와 자동 동기화되지 않아요.</p>{specialties.length ? <div className="mt-6 grid gap-3">{specialties.map((specialty) => <article className="rounded-2xl border border-stone-200 bg-white p-5" key={specialty.id}><p className="text-sm font-semibold text-emerald-700">{specialty.branch} · {specialty.specialtyCode || "코드 미표기"}</p><h2 className="mt-2 text-xl font-bold">{specialty.name}</h2><p className="mt-2 text-sm text-stone-600">{specialty.recruitmentCategories.join(" · ")}</p><div className="mt-4 flex gap-3"><Link className="text-sm font-semibold text-emerald-700 hover:underline" href={`/specialties/${specialty.slug}`}>상세 보기</Link><button className="text-sm font-semibold text-stone-500 hover:underline" onClick={() => toggle(specialty.id, "detail")} type="button">저장 해제</button></div></article>)}</div> : <section className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center"><h2 className="text-xl font-bold">아직 저장한 특기가 없어요</h2><Link className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:underline" href="/specialties">공식 특기 둘러보기</Link></section>}</div></main>;
}
