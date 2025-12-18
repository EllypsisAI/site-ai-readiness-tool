"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lock, CheckCircle2, Code } from "lucide-react";

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

interface Personalization {
  topFailingMetrics: CheckResult[];
}

interface Props {
  checks: CheckResult[];
  aiInsights?: AIInsight[];
  topPriorities?: string[];
  personalization: Personalization;
  isActive: boolean;
}

// Sample action items to show as preview (these would come from the actual analysis in the full report)
const previewActionItems = [
  {
    title: "Add semantic heading structure",
    code: `<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>`,
    impact: "High",
  },
  {
    title: "Implement meta description",
    code: `<meta name="description"
  content="Your 150-160 char description">`,
    impact: "High",
  },
  {
    title: "Create llms.txt file",
    code: `# llms.txt
User-agent: *
Allow: /`,
    impact: "Medium",
  },
];

export default function DetailedFindings({ checks, aiInsights, topPriorities, personalization, isActive }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Combine action items from both basic checks and AI insights
  const allChecks = [...checks, ...(aiInsights || [])];
  const realActionItems = allChecks
    .filter((c) => c.actionItems && c.actionItems.length > 0)
    .flatMap((c) => c.actionItems || [])
    .slice(0, 2);

  // Check if we have AI insights for richer content
  const hasAIInsights = aiInsights && aiInsights.length > 0;
  const totalActionItems = allChecks.reduce(
    (sum, c) => sum + (c.actionItems?.length || 0),
    0
  );
  const totalDeepDives = allChecks.length;

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-16 lg:px-24 py-80"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-900 mx-auto"
      >
        {/* Headline */}
        <motion.div
          className="text-center mb-48"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-title-h1 text-accent-black mb-16">
            We found 40+ specific fixes
          </h2>
          <p className="text-body-large text-black-alpha-64">
            Here's a preview of what your detailed report includes
          </p>
        </motion.div>

        {/* Preview cards - some visible, some blurred */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
          {/* Visible preview cards */}
          {previewActionItems.slice(0, 2).map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-accent-white border border-black-alpha-8 rounded-12 p-20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + idx * 0.15 }}
            >
              <div className="flex items-start justify-between mb-12">
                <div className="flex items-center gap-8">
                  <Code className="w-18 h-18 text-accent-black" />
                  <span className="text-label-medium font-medium">{item.title}</span>
                </div>
                <span className={`text-label-small px-8 py-4 rounded-4 ${
                  item.impact === "High"
                    ? "bg-heat-100 bg-opacity-10 text-heat-100"
                    : "bg-black-alpha-8 text-black-alpha-64"
                }`}>
                  {item.impact} Impact
                </span>
              </div>
              <pre className="text-body-small bg-black-alpha-4 rounded-8 p-12 overflow-x-auto">
                <code className="text-accent-black">{item.code}</code>
              </pre>
            </motion.div>
          ))}

          {/* Blurred preview cards */}
          {[1, 2].map((_, idx) => (
            <motion.div
              key={`blur-${idx}`}
              className="relative bg-accent-white border border-black-alpha-8 rounded-12 p-20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + idx * 0.15 }}
            >
              {/* Blurred content */}
              <div className="blur-sm select-none pointer-events-none">
                <div className="flex items-start justify-between mb-12">
                  <div className="flex items-center gap-8">
                    <Code className="w-18 h-18 text-accent-black" />
                    <span className="text-label-medium font-medium">
                      Optimize structured data
                    </span>
                  </div>
                  <span className="text-label-small px-8 py-4 rounded-4 bg-heat-100 bg-opacity-10 text-heat-100">
                    High Impact
                  </span>
                </div>
                <pre className="text-body-small bg-black-alpha-4 rounded-8 p-12">
                  <code className="text-accent-black">
                    {`<script type="application/ld+json">
{ "@context": "..." }`}
                  </code>
                </pre>
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-accent-white bg-opacity-60">
                <div className="flex items-center gap-8 text-black-alpha-48">
                  <Lock className="w-16 h-16" />
                  <span className="text-label-medium">Unlock in full report</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* What's included summary */}
        <motion.div
          className="bg-black-alpha-4 rounded-12 p-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
        >
          <h3 className="text-label-large font-medium text-accent-black mb-16 text-center">
            Your full report includes
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { number: hasAIInsights ? `${Math.max(totalActionItems, 40)}+` : "40+", label: "Action items" },
              { number: hasAIInsights ? `${totalDeepDives}` : "8", label: "Deep-dive analyses" },
              { number: hasAIInsights ? `${Math.max(Math.floor(totalActionItems * 0.5), 20)}+` : "20+", label: "Code examples" },
              { number: topPriorities?.length ? `${topPriorities.length}` : "1", label: topPriorities?.length ? "Top priorities" : "Priority roadmap" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.1 + idx * 0.1 }}
              >
                <div className="text-title-h2 text-accent-black">{stat.number}</div>
                <div className="text-label-small text-black-alpha-48">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
