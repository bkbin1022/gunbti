import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findOfficialSpecialty, officialSpecialties } from "@/lib/official-specialties";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return officialSpecialties.map((specialty) => ({ slug: specialty.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const specialty = findOfficialSpecialty((await params).slug);
  return specialty ? { title: `${specialty.name} | 특급꿀벌`, description: `${specialty.branch} ${specialty.name}의 병무청 공식 특기 정보` } : {};
}

export default async function SpecialtyPage({ params }: Props) {
  const specialty = findOfficialSpecialty((await params).slug);
  if (!specialty) notFound();

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-3xl">
        <nav className="text-sm text-stone-500"><Link href="/">홈</Link> · <Link href="/specialties">공식 특기</Link> · {specialty.name}</nav>
        <header className="mt-8 rounded-3xl border border-stone-200 bg-white p-7 sm:p-9">
          <p className="text-sm font-semibold text-emerald-700">{specialty.branch} · 특기 코드 {specialty.specialtyCode ?? "미표기"}</p>
          <h1 className="mt-3 text-3xl font-bold">{specialty.name}</h1>
          <p className="mt-4 leading-7 text-stone-600">이 특기명과 모집 분류는 병무청 군사특기마스터 OpenAPI에서 가져온 공식 데이터입니다.</p>
        </header>
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-stone-200 bg-white p-5"><h2 className="font-bold">모집 분류</h2><p className="mt-3 text-sm leading-6 text-stone-600">{specialty.recruitmentCategories.join(" · ") || "미표기"}</p></article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5"><h2 className="font-bold">동기화 기준</h2><p className="mt-3 text-sm leading-6 text-stone-600">모집 공고에서 {specialty.observedRecruitmentCount}회 확인된 특기입니다.</p></article>
        </section>
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <h2 className="font-bold">지원 전 확인</h2>
          <p className="mt-2">이 페이지는 특기 마스터의 명칭·코드·모집 분류만 제공합니다. 모집 시기, 자격·면허, 신체 요건, 실제 업무 환경은 매 회차 공식 모집 공고를 기준으로 달라질 수 있습니다.</p>
        </section>
        <div className="mt-8 flex gap-3"><Link className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white" href="/test">내 성향으로 추천받기</Link><Link className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold" href="/specialties">목록으로</Link></div>
        <p className="mt-10 text-xs text-stone-500">출처: {specialty.source.label} · 동기화 {new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(specialty.source.retrievedAt))}</p>
      </div>
    </main>
  );
}
