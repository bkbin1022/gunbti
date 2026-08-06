import { ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Compass, title: "클릭 한 번이면 다음", description: "답을 고르면 바로 다음 질문으로 슝 넘어가요." },
  { icon: ShieldCheck, title: "가볍게, 안전하게", description: "민감한 군 복무 정보나 건강 정보는 받지 않아요." },
  { icon: Sparkles, title: "내 스타일에 찰떡", description: "직무 특징과 내 성향을 쉽고 투명하게 비교해요." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between">
          <Link className="text-lg font-bold tracking-tight" href="/">특급꿀벌</Link>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">#내_군생활_탐색기</span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-20">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-emerald-700"><Sparkles className="size-4" /> 내 성향으로 찾아보는 군 직무</p>
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">내게 <span className="text-emerald-700">꿀</span>인 군 생활,<br />어디에 있을까?</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">10개 질문이면 끝. 내 스타일에 잘 맞는 군 직무군을 가볍게 찾아봐요. 답을 누르면 다음 질문으로 바로 넘어갑니다.</p>
            <Link className="mt-9 inline-flex h-12 items-center rounded-full bg-emerald-700 px-6 text-base font-medium text-white transition hover:bg-emerald-800" href="/test">내 꿀보직 찾기 <ArrowRight className="ml-2 size-4" /></Link>
            <Link className="ml-4 inline-flex h-12 items-center text-sm font-semibold text-emerald-800 hover:underline" href="/specialties">공식 특기 289개 보기</Link>
            <p className="mt-3 text-sm text-stone-500">탐색용 결과예요. 실제 선발·배치 기준은 공식 안내를 꼭 확인해 주세요.</p>
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
