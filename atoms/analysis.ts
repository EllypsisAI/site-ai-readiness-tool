import { atom } from "jotai";

export interface CheckResult {
  id: string;
  label: string;
  status: "pass" | "fail" | "warning" | "pending" | "checking";
  score: number;
  details?: string;
  recommendation?: string;
  actionItems?: string[];
}

export interface AnalysisData {
  id: string | null;
  url: string;
  domain: string;
  overallScore: number;
  checks: CheckResult[];
  htmlContent?: string;
  metadata?: {
    title?: string;
    description?: string;
    analyzedAt?: string;
  };
  aiInsights?: CheckResult[];
  aiOverallReadiness?: string;
  aiTopPriorities?: string[];
  enhancedScore?: number;
}

export type FunnelStep =
  | "input"        // Initial URL input
  | "analyzing"    // Running analysis
  | "results"      // Showing basic results
  | "scrolly"      // In scrolly journey
  | "email"        // Email capture modal
  | "checkout";    // Checkout flow

// Core analysis state
export const analysisIdAtom = atom<string | null>(null);
export const analysisDataAtom = atom<AnalysisData | null>(null);
export const isAnalyzingAtom = atom<boolean>(false);
export const showResultsAtom = atom<boolean>(false);

// Funnel tracking
export const funnelStepAtom = atom<FunnelStep>("input");

// Derived atoms for convenience
export const hasAnalysisAtom = atom((get) => {
  const data = get(analysisDataAtom);
  return data !== null && data.id !== null;
});

export const overallScoreAtom = atom((get) => {
  const data = get(analysisDataAtom);
  return data?.enhancedScore || data?.overallScore || 0;
});

// Actions
export const resetAnalysisAtom = atom(null, (get, set) => {
  set(analysisIdAtom, null);
  set(analysisDataAtom, null);
  set(isAnalyzingAtom, false);
  set(showResultsAtom, false);
  set(funnelStepAtom, "input");
});
