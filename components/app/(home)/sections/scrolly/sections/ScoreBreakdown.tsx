"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, ArrowDown } from "lucide-react";

interface CheckResult {
  id: string;
  label: string;
  status: "pass" | "fail" | "warning";
  score: number;
  details?: string;
}

interface Personalization {
  scoreMessage: string;
  scoreContext: string;
  urgencyLevel: "low" | "medium" | "high";
  topFailingMetrics: CheckResult[];
  passCount: number;
  warningCount: number;
  failCount: number;
}

interface Props {
  score: number;
  checks: CheckResult[];
  personalization: Personalization;
  isActive: boolean;
}

export default function ScoreBreakdown({ score, checks, personalization, isActive }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-accent-black";
    if (s >= 60) return "text-heat-100";
    return "text-heat-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-20 h-20 text-accent-black" />;
      case "fail":
        return <XCircle className="w-20 h-20 text-heat-200" />;
      case "warning":
        return <AlertCircle className="w-20 h-20 text-heat-100" />;
      default:
        return null;
    }
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-16 lg:px-24 py-80"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-800 mx-auto text-center"
      >
        {/* Score headline */}
        <motion.h2
          className="text-title-h1 text-accent-black mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          Your site scored{" "}
          <span className={getScoreColor(score)}>{score}%</span>
        </motion.h2>

        <motion.p
          className="text-body-large text-black-alpha-64 mb-40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          {personalization.scoreMessage}. {personalization.scoreContext}
        </motion.p>

        {/* Quick stats */}
        <motion.div
          className="flex justify-center gap-32 mb-48"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-title-h2 text-accent-black">{personalization.passCount}</div>
            <div className="text-label-small text-black-alpha-48">Passing</div>
          </div>
          <div className="text-center">
            <div className="text-title-h2 text-heat-100">{personalization.warningCount}</div>
            <div className="text-label-small text-black-alpha-48">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-title-h2 text-heat-200">{personalization.failCount}</div>
            <div className="text-label-small text-black-alpha-48">Failing</div>
          </div>
        </motion.div>

        {/* Top issues highlight */}
        {personalization.topFailingMetrics.length > 0 && (
          <motion.div
            className="bg-heat-4 border border-heat-100 border-opacity-20 rounded-12 p-24 mb-40"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-label-large font-medium text-accent-black mb-16">
              Top areas needing attention
            </h3>
            <div className="space-y-12">
              {personalization.topFailingMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.id}
                  className="flex items-center gap-12 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                >
                  {getStatusIcon(metric.status)}
                  <div className="flex-1">
                    <div className="text-label-medium text-accent-black">{metric.label}</div>
                    <div className="text-body-small text-black-alpha-48">{metric.details}</div>
                  </div>
                  <div className={`text-label-large font-medium ${getScoreColor(metric.score)}`}>
                    {metric.score}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scroll prompt */}
        <motion.div
          className="flex flex-col items-center gap-8 text-black-alpha-32"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <span className="text-label-small">Scroll to learn more</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="w-20 h-20" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
