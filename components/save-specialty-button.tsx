"use client";

import { Bookmark } from "lucide-react";
import { useSavedSpecialties } from "@/components/saved-specialties-provider";

export function SaveSpecialtyButton({ specialtyId, source = "detail" }: { specialtyId: string; source?: "result" | "directory" | "detail" | "recruitment" | "comparison" }) {
  const { isSaved, toggle } = useSavedSpecialties();
  const saved = isSaved(specialtyId);
  return <button aria-pressed={saved} className={`inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold ${saved ? "bg-emerald-100 text-emerald-900" : "border border-stone-300 bg-white text-stone-700"}`} onClick={() => toggle(specialtyId, source)} type="button"><Bookmark className="mr-2 size-4" fill={saved ? "currentColor" : "none"} />{saved ? "저장됨" : "관심 특기 저장"}</button>;
}
