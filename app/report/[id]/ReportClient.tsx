"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  FileText,
  Code,
  Shield,
  Network,
  Bot,
  Eye,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Share2,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

interface CheckResult {
  id: string;
  label: string;
  status: "pass" | "fail" | "warning";
  score: number;
  details: string;
  recommendation: string;
}

interface AnalysisData {
  id: string;
  url: string;
  domain: string;
  overallScore: number;
  checks: CheckResult[];
  metadata: { title?: string; description?: string; analyzedAt?: string } | null;
  aiInsights: unknown;
  aiOverallReadiness: string | null;
  aiTopPriorities: unknown;
  enhancedScore: number | null;
  createdAt: string;
}

const iconMap: Record<string, React.ElementType> = {
  "heading-structure": FileText,
  readability: Globe,
  "meta-tags": FileCode,
  "semantic-html": Code,
  accessibility: Eye,
  "llms-txt": Bot,
  "robots-txt": Shield,
  sitemap: Network,
};

export default function ReportClient({ analysis }: { analysis: AnalysisData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: CheckResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-16 h-16 text-accent-black" />;
      case "fail":
        return <XCircle className="w-16 h-16 text-heat-200" />;
      case "warning":
        return <AlertCircle className="w-16 h-16 text-heat-100" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-black";
    if (score >= 60) return "text-heat-100";
    return "text-heat-200";
  };

  const passCount = analysis.checks.filter((c) => c.status === "pass").length;
  const warningCount = analysis.checks.filter((c) => c.status === "warning").length;
  const failCount = analysis.checks.filter((c) => c.status === "fail").length;

  return (
    <div className="min-h-screen bg-background-base">
      {/* Header */}
      <header className="border-b border-border-faint">
        <div className="max-w-[1200px] mx-auto px-16 py-16 flex justify-between items-center">
          <Link href="/" className="text-label-large font-medium text-accent-black">
            AI Readiness Analysis
          </Link>
          <button
            onClick={handleCopy}
            className="flex items-center gap-8 px-12 py-6 bg-black-alpha-4 hover:bg-black-alpha-8 rounded-8 text-label-medium transition-all"
          >
            {copied ? (
              <>
                <Check className="w-14 h-14" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-14 h-14" />
                Share Report
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-16 py-48">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-48"
        >
          <h1 className="text-title-h1 text-accent-black mb-8">{analysis.domain}</h1>
          <p className="text-body-large text-black-alpha-64 mb-24">{analysis.url}</p>

          {/* Score Circle */}
          <div className="relative inline-flex items-center justify-center w-180 h-180 mb-24">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="90"
                cy="90"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-black-alpha-8"
              />
              <motion.circle
                cx="90"
                cy="90"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                className={getScoreColor(analysis.overallScore)}
                strokeDasharray={502.65}
                initial={{ strokeDashoffset: 502.65 }}
                animate={{
                  strokeDashoffset: 502.65 - (502.65 * analysis.overallScore) / 100,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="text-center">
              <motion.div
                className={`text-title-h1 font-bold ${getScoreColor(analysis.overallScore)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {analysis.overallScore}%
              </motion.div>
              <div className="text-label-small text-black-alpha-48">AI Readiness</div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex justify-center gap-24 text-label-medium">
            <div className="flex items-center gap-6">
              <CheckCircle2 className="w-16 h-16 text-accent-black" />
              <span>{passCount} Passing</span>
            </div>
            <div className="flex items-center gap-6">
              <AlertCircle className="w-16 h-16 text-heat-100" />
              <span>{warningCount} Warnings</span>
            </div>
            <div className="flex items-center gap-6">
              <XCircle className="w-16 h-16 text-heat-200" />
              <span>{failCount} Failing</span>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-48"
        >
          {analysis.checks.map((check, index) => {
            const Icon = iconMap[check.id] || FileText;
            return (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-20 bg-accent-white border border-black-alpha-8 rounded-8"
              >
                <div className="flex items-start justify-between mb-12">
                  <div className="flex items-center gap-12">
                    <div className="p-8 bg-black-alpha-4 rounded-8">
                      <Icon className="w-20 h-20 text-accent-black" />
                    </div>
                    <div>
                      <h3 className="text-label-large font-medium text-accent-black">
                        {check.label}
                      </h3>
                      <p className="text-body-small text-black-alpha-64">{check.details}</p>
                    </div>
                  </div>
                  {getStatusIcon(check.status)}
                </div>

                {/* Score Bar */}
                <div className="mb-12">
                  <div className="flex justify-between text-label-small mb-4">
                    <span className="text-black-alpha-48">Score</span>
                    <span className={getScoreColor(check.score)}>{check.score}%</span>
                  </div>
                  <div className="h-4 bg-black-alpha-8 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        check.status === "pass"
                          ? "bg-accent-black"
                          : check.status === "warning"
                          ? "bg-heat-100"
                          : "bg-heat-200"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${check.score}%` }}
                      transition={{ duration: 0.5, delay: 0.2 * index }}
                    />
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-12 bg-black-alpha-4 rounded-6">
                  <p className="text-body-small text-black-alpha-64">{check.recommendation}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center p-40 bg-gradient-to-br from-accent-white to-heat-4 border border-heat-100 border-opacity-20 rounded-12"
        >
          <h2 className="text-title-h2 text-accent-black mb-12">
            Get Your Detailed Action Report
          </h2>
          <p className="text-body-large text-black-alpha-64 mb-24 max-w-600 mx-auto">
            Unlock 40+ specific fixes with code examples, prioritized by impact. Our detailed PDF
            report shows you exactly what to change to improve your AI readiness score.
          </p>
          <Link
            href={`/?analysisId=${analysis.id}`}
            className="inline-flex items-center gap-8 px-24 py-12 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-large font-medium transition-all"
          >
            Get Full Report
            <ArrowRight className="w-18 h-18" />
          </Link>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-48 pt-24 border-t border-border-faint">
          <p className="text-body-small text-black-alpha-48">
            Analyzed on {new Date(analysis.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <Link
            href="/"
            className="text-label-medium text-accent-black hover:underline mt-8 inline-block"
          >
            Analyze another site →
          </Link>
        </div>
      </main>
    </div>
  );
}
