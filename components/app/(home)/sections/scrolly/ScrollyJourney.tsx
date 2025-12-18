"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePersonalization } from "./hooks/usePersonalization";
import ScoreBreakdown from "./sections/ScoreBreakdown";
import ProblemStatement from "./sections/ProblemStatement";
import CompetitorContext from "./sections/CompetitorContext";
import DetailedFindings from "./sections/DetailedFindings";
import SolutionPreview from "./sections/SolutionPreview";
import PricingCTA from "./sections/PricingCTA";

interface CheckResult {
  id: string;
  label: string;
  status: "pass" | "fail" | "warning";
  score: number;
  details?: string;
  recommendation?: string;
  actionItems?: string[];
}

interface AIInsight {
  id: string;
  label: string;
  score: number;
  status: "pass" | "warning" | "fail";
  details?: string;
  recommendation?: string;
  actionItems?: string[];
}

interface AnalysisData {
  id?: string | null;
  url: string;
  domain?: string;
  overallScore: number;
  checks: CheckResult[];
  metadata?: {
    title?: string;
    description?: string;
  };
  // AI insights data
  aiInsights?: AIInsight[];
  overallAIReadiness?: string;
  topPriorities?: string[];
}

interface ScrollyJourneyProps {
  analysisData: AnalysisData;
  onEmailCapture?: (email: string) => void;
  onCheckout?: () => void;
}

export default function ScrollyJourney({
  analysisData,
  onEmailCapture,
  onCheckout,
}: ScrollyJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, activeSection, isInView } = useScrollProgress(containerRef, 6);

  // Extract domain from URL if not provided
  const domain = analysisData.domain || new URL(analysisData.url).hostname;
  const enrichedData = { ...analysisData, domain };

  // Pass AI insights to personalization hook for enhanced messaging
  const personalization = usePersonalization(enrichedData);

  // Combine basic checks with AI insights for detailed findings
  const hasAIInsights = analysisData.aiInsights && analysisData.aiInsights.length > 0;

  if (!personalization) return null;

  return (
    <div
      ref={containerRef}
      className="relative bg-background-base"
    >
      {/* Progress indicator - fixed on side */}
      <div className="fixed right-24 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className={`w-8 h-8 rounded-full transition-all duration-300 ${
              activeSection >= i
                ? "bg-accent-black scale-125"
                : "bg-black-alpha-16"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: isInView ? 1 : 0 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Section 1: Score Breakdown */}
      <ScoreBreakdown
        score={analysisData.overallScore}
        checks={analysisData.checks}
        personalization={personalization}
        isActive={activeSection === 0}
      />

      {/* Section 2: Problem Statement */}
      <ProblemStatement
        domain={domain}
        personalization={personalization}
        isActive={activeSection === 1}
      />

      {/* Section 3: Competitor Context */}
      <CompetitorContext
        score={analysisData.overallScore}
        personalization={personalization}
        isActive={activeSection === 2}
      />

      {/* Section 4: Detailed Findings Preview */}
      <DetailedFindings
        checks={analysisData.checks}
        aiInsights={analysisData.aiInsights}
        topPriorities={analysisData.topPriorities}
        personalization={personalization}
        isActive={activeSection === 3}
      />

      {/* Section 5: Solution Preview */}
      <SolutionPreview
        domain={domain}
        score={analysisData.overallScore}
        personalization={personalization}
        isActive={activeSection === 4}
      />

      {/* Section 6: Pricing CTA */}
      <PricingCTA
        domain={domain}
        analysisId={analysisData.id}
        personalization={personalization}
        onEmailCapture={onEmailCapture}
        onCheckout={onCheckout}
        isActive={activeSection === 5}
      />
    </div>
  );
}
