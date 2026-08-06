"use client";

import { useState } from "react";

const categories = [
  ["incorrectName", "특기명 오류"],
  ["outdatedRecruitmentStatus", "모집 정보가 오래됨"],
  ["incorrectRequirement", "지원 조건 오류"],
  ["incorrectDescription", "설명 오류"],
  ["brokenSource", "출처 링크 오류"],
  ["other", "기타"],
] as const;

export function SpecialtyReportForm({ specialtyId, pageUrl, dataVersion }: { specialtyId: string; pageUrl: string; dataVersion: string }) {
  const [category, setCategory] = useState<(typeof categories)[number][0]>("other");
  const [message, setMessage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const response = await fetch("/api/specialties/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ specialtyId, category, message, sourceUrl, pageUrl, dataVersion, website: new FormData(form).get("website") }) });
    if (response.ok) { setStatus("success"); setMessage(""); setSourceUrl(""); return; }
    setStatus("error");
  }

  return <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
    <h2 className="font-bold">정보 수정 제보</h2>
    <p className="mt-2 text-sm leading-6 text-stone-600">공개적으로 확인 가능한 정보만 제보해 주세요. 부대 위치, 작전 내용, 근무 일정, 인원 현황 등 비공개 군사정보는 작성하면 안 됩니다.</p>
    {status === "success" ? <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900">제보를 받았어요. 검토 후 반영 여부를 확인하겠습니다.</p> : <form className="mt-4 grid gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm font-medium">분류<select className="h-10 rounded-lg border border-stone-300 bg-white px-3" onChange={(event) => setCategory(event.target.value as typeof category)} value={category}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium">내용<textarea className="min-h-28 rounded-lg border border-stone-300 p-3" maxLength={1000} onChange={(event) => setMessage(event.target.value)} required value={message} /></label>
      <label className="grid gap-1 text-sm font-medium">공개 출처 링크 <span className="font-normal text-stone-500">(선택)</span><input className="h-10 rounded-lg border border-stone-300 px-3" inputMode="url" onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://" value={sourceUrl} /></label>
      <label className="sr-only" aria-hidden="true">웹사이트<input autoComplete="off" name="website" tabIndex={-1} /></label>
      <button className="h-10 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={status === "sending"} type="submit">{status === "sending" ? "보내는 중…" : "제보 보내기"}</button>
      {status === "error" && <p aria-live="polite" className="text-sm text-rose-700">제보를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
    </form>}
  </section>;
}
