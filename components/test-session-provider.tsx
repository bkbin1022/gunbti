"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";

import { calculateTraitProfile, getRecommendations } from "@/lib/recommendation";
import type { TestSession, UserGoal } from "@/lib/recommendation-types";

const storageKey = "teukgeup-honeybee-sprint-2";
const initialSession: TestSession = { answers: {}, traitProfile: null, selectedGoal: null, recommendations: [] };

type Action =
  | { type: "answer"; id: string; value: number }
  | { type: "goal"; goal: UserGoal }
  | { type: "complete" }
  | { type: "replace"; session: TestSession }
  | { type: "reset" };

function reducer(state: TestSession, action: Action): TestSession {
  if (action.type === "answer") return { ...state, answers: { ...state.answers, [action.id]: action.value }, recommendations: [] };
  if (action.type === "goal") return { ...state, selectedGoal: action.goal, recommendations: [] };
  if (action.type === "complete") {
    const traitProfile = calculateTraitProfile(state.answers);
    return { ...state, traitProfile, recommendations: getRecommendations(traitProfile, state.selectedGoal), completedAt: new Date().toISOString() };
  }
  if (action.type === "replace") return action.session;
  return initialSession;
}

type SessionContextValue = { session: TestSession; ready: boolean; answer: (id: string, value: number) => void; chooseGoal: (goal: UserGoal) => void; complete: () => void; reset: () => void };
const SessionContext = createContext<SessionContextValue | null>(null);

export function TestSessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, initialSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as TestSession;
          if (parsed && typeof parsed.answers === "object" && Array.isArray(parsed.recommendations)) dispatch({ type: "replace", session: parsed });
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(session));
  }, [ready, session]);

  const value = useMemo<SessionContextValue>(() => ({
    session, ready,
    answer: (id, value) => dispatch({ type: "answer", id, value }),
    chooseGoal: (goal) => dispatch({ type: "goal", goal }),
    complete: () => dispatch({ type: "complete" }),
    reset: () => dispatch({ type: "reset" }),
  }), [ready, session]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useTestSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useTestSession must be used inside TestSessionProvider");
  return context;
}
