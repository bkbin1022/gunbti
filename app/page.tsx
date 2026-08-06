import { ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  { icon: Compass, title: "성향 탐색", description: "일하는 방식과 선호를 살펴봅니다." },
  { icon: ShieldCheck, title: "정보 보호", description: "민감한 정보를 수집하지 않습니다." },
  { icon: Sparkles, title: "맞춤 추천", description: "직무 특성과 성향을 투명하게 비교합니다." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">군BTI</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">MVP 준비 중</span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-20">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-emerald-700"><Sparkles className="size-4" /> 나의 성향으로 알아보는 군 직무</p>
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">군 생활의 방향을<br /><span className="text-emerald-700">나답게</span> 찾아보세요.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">간단한 질문에 답하면 나의 성향과 잘 맞는 군 직무를 추천해 드립니다. 결과는 진로 탐색을 돕기 위한 참고 자료입니다.</p>
            <Button className="mt-9 h-12 rounded-full bg-emerald-700 px-6 text-base hover:bg-emerald-800" disabled>
              설문 시작하기 <ArrowRight className="ml-2 size-4" />
            </Button>
            <p className="mt-3 text-sm text-stone-500">설문 기능은 다음 개발 단계에서 연결됩니다.</p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div className="rounded-2xl border border-stone-200 bg-white p-5" key={title}>
                <Icon className="mb-4 size-5 text-emerald-700" />
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
