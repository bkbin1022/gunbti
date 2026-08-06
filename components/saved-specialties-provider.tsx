"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const storageKey = "teukgeup-honeybee-saved-specialties-v1";
type SavedSource = "result" | "directory" | "detail" | "recruitment" | "comparison";
type SavedSpecialty = { specialtyId: string; savedAt: string; sourceLocation: SavedSource };
type SavedContext = { saved: SavedSpecialty[]; toggle: (specialtyId: string, source: SavedSource) => void; isSaved: (specialtyId: string) => boolean };
const Context = createContext<SavedContext | null>(null);

export function SavedSpecialtiesProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedSpecialty[]>(() => { if (typeof window === "undefined") return []; try { const value = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(value) ? value.filter((item) => item && typeof item.specialtyId === "string") : []; } catch { localStorage.removeItem(storageKey); return []; } });
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(saved)); }, [saved]);
  const value = useMemo<SavedContext>(() => ({ saved, isSaved: (specialtyId) => saved.some((item) => item.specialtyId === specialtyId), toggle: (specialtyId, sourceLocation) => setSaved((current) => current.some((item) => item.specialtyId === specialtyId) ? current.filter((item) => item.specialtyId !== specialtyId) : [...current, { specialtyId, sourceLocation, savedAt: new Date().toISOString() }]) }), [saved]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSavedSpecialties() { const context = useContext(Context); if (!context) throw new Error("SavedSpecialtiesProvider is required"); return context; }
