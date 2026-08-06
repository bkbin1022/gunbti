"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { OfficialBranch, OfficialSpecialty } from "@/lib/official-specialties";

const branches: (OfficialBranch | "전체")[] = ["전체", "육군", "해군", "공군", "해병"];

export function SpecialtyDirectory({ specialties }: { specialties: OfficialSpecialty[] }) {
  const [branch, setBranch] = useState<(typeof branches)[number]>("전체");
  const [query, setQuery] = useState("");
  const visibleSpecialties = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return specialties.filter((specialty) => {
      const matchesBranch = branch === "전체" || specialty.branch === branch;
      const searchable = [specialty.name, specialty.specialtyCode, ...specialty.recruitmentCategories].filter(Boolean).join(" ").toLowerCase();
      return matchesBranch && (!keyword || searchable.includes(keyword));
    });
  }, [branch, query, specialties]);

  return <section className="mt-8">
    <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="relative"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" /><input aria-label="공식 특기 검색" className="h-12 w-full rounded-xl border border-stone-300 bg-stone-50 pl-12 pr-12 text-base outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" onChange={(event) => setQuery(event.target.value)} placeholder="특기명, 코드, 모집 분류로 검색" value={query} />{query && <button aria-label="검색어 지우기" className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-stone-500 hover:bg-stone-100" onClick={() => setQuery("")} type="button"><X className="size-4" /></button>}</div>
      <div aria-label="군종 필터" className="flex flex-wrap gap-2">{branches.map((item) => <button aria-pressed={branch === item} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${branch === item ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`} key={item} onClick={() => setBranch(item)} type="button">{item}</button>)}</div>
    </div>
    <p aria-live="polite" className="mt-5 text-sm text-stone-600"><strong className="text-stone-950">{visibleSpecialties.length}개</strong> 특기를 찾았어요.</p>
    {visibleSpecialties.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visibleSpecialties.map((specialty) => <Link className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm" href={`/specialties/${specialty.slug}`} key={specialty.id}>
      <p className="text-sm font-semibold text-emerald-700">{specialty.branch} · {specialty.specialtyCode ?? "코드 미표기"}</p>
      <h3 className="mt-2 text-lg font-bold">{specialty.name}</h3>
      <p className="mt-3 text-sm leading-6 text-stone-600">{specialty.recruitmentCategories.join(" · ") || "모집 분류 미표기"}</p>
    </Link>)}</div> : <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center"><p className="font-semibold">찾는 특기가 없어요.</p><p className="mt-2 text-sm text-stone-600">다른 키워드나 군종을 선택해 보세요.</p><button className="mt-4 text-sm font-semibold text-emerald-700 hover:underline" onClick={() => { setBranch("전체"); setQuery(""); }} type="button">전체 특기 보기</button></div>}
  </section>;
}
