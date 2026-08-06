import Link from "next/link";
import { SpecialtyDirectory } from "@/components/specialty-directory";
import { officialSpecialties, officialSpecialtyCounts, type OfficialBranch } from "@/lib/official-specialties";

const branchOrder: OfficialBranch[] = ["육군", "해군", "공군", "해병"];

export default function SpecialtiesPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-stone-950">
      <div className="mx-auto max-w-6xl">
        <nav className="text-sm text-stone-500"><Link href="/">홈</Link> · 공식 특기</nav>
        <header className="mt-8 rounded-3xl bg-emerald-800 p-7 text-white sm:p-10">
          <p className="text-sm font-semibold text-emerald-100">병무청 군사특기마스터 기준</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">공식 특기 289개, 한눈에 보기</h1>
          <p className="mt-4 max-w-2xl leading-7 text-emerald-50">특기명·군종·모집 분류는 병무청 공개 API에서 동기화했습니다. 실제 모집 가능 여부와 지원 조건은 모집 공고에서 다시 확인해 주세요.</p>
        </header>
        <div className="mt-6 flex flex-wrap gap-2">
          {branchOrder.map((branch) => <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm" key={branch}>{branch} {officialSpecialtyCounts[branch]}개</span>)}
        </div>
        <SpecialtyDirectory specialties={officialSpecialties} />
      </div>
    </main>
  );
}
