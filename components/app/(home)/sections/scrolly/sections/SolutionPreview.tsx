"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, CheckCircle2, Code2, ListChecks, BarChart3 } from "lucide-react";

interface Personalization {
  urgencyLevel: "low" | "medium" | "high";
}

interface Props {
  domain: string;
  score: number;
  personalization: Personalization;
  isActive: boolean;
}

const reportSections = [
  {
    icon: BarChart3,
    title: "Executive Summary",
    description: "High-level overview for stakeholders",
  },
  {
    icon: ListChecks,
    title: "Top 10 Priorities",
    description: "Highest-impact fixes to tackle first",
  },
  {
    icon: FileText,
    title: "Detailed Analysis",
    description: "Deep-dive into all 8 metrics",
  },
  {
    icon: Code2,
    title: "Code Examples",
    description: "Copy-paste implementation snippets",
  },
];

export default function SolutionPreview({ domain, score, personalization, isActive }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-16 lg:px-24 py-80 bg-black-alpha-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-1000 mx-auto"
      >
        {/* Headline */}
        <motion.div
          className="text-center mb-48"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-title-h1 text-accent-black mb-16">
            Your personalized action plan
          </h2>
          <p className="text-body-large text-black-alpha-64">
            A comprehensive PDF report tailored specifically for {domain}
          </p>
        </motion.div>

        {/* Mock PDF preview */}
        <motion.div
          className="relative bg-accent-white rounded-12 shadow-lg overflow-hidden mb-40"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* PDF Header */}
          <div className="bg-accent-black text-white p-24">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-label-small text-white-alpha-64 mb-4">
                  AI Readiness Report
                </div>
                <div className="text-title-h3">{domain}</div>
              </div>
              <div className="text-right">
                <div className="text-title-h2">{score}%</div>
                <div className="text-label-small text-white-alpha-64">Overall Score</div>
              </div>
            </div>
          </div>

          {/* PDF Content Preview */}
          <div className="p-24">
            {/* Table of contents */}
            <div className="mb-24">
              <h4 className="text-label-large font-medium text-accent-black mb-12">
                What's Inside
              </h4>
              <div className="space-y-8">
                {reportSections.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <motion.div
                      key={section.title}
                      className="flex items-center gap-12 p-12 rounded-8 hover:bg-black-alpha-4 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <div className="p-8 bg-black-alpha-4 rounded-8">
                        <Icon className="w-18 h-18 text-accent-black" />
                      </div>
                      <div className="flex-1">
                        <div className="text-label-medium text-accent-black">
                          {section.title}
                        </div>
                        <div className="text-body-small text-black-alpha-48">
                          {section.description}
                        </div>
                      </div>
                      <CheckCircle2 className="w-18 h-18 text-accent-black" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Sample content preview */}
            <motion.div
              className="border-t border-black-alpha-8 pt-24"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-8 text-label-small text-black-alpha-32 mb-12">
                <FileText className="w-14 h-14" />
                Preview: Executive Summary
              </div>
              <div className="bg-black-alpha-4 rounded-8 p-16">
                <div className="h-4 bg-black-alpha-8 rounded w-3/4 mb-8" />
                <div className="h-4 bg-black-alpha-8 rounded w-full mb-8" />
                <div className="h-4 bg-black-alpha-8 rounded w-5/6 mb-8" />
                <div className="h-4 bg-black-alpha-8 rounded w-2/3" />
              </div>
            </motion.div>
          </div>

          {/* Decorative page curl */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-black-alpha-8 to-transparent" />
        </motion.div>

        {/* Delivery info */}
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-center gap-24 text-center lg:text-left"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-12">
            <div className="p-12 bg-accent-white rounded-full shadow-sm">
              <FileText className="w-24 h-24 text-accent-black" />
            </div>
            <div>
              <div className="text-label-medium text-accent-black">PDF Format</div>
              <div className="text-body-small text-black-alpha-48">Easy to share with your team</div>
            </div>
          </div>
          <div className="hidden lg:block w-1 h-40 bg-black-alpha-8" />
          <div className="flex items-center gap-12">
            <div className="p-12 bg-accent-white rounded-full shadow-sm">
              <CheckCircle2 className="w-24 h-24 text-accent-black" />
            </div>
            <div>
              <div className="text-label-medium text-accent-black">Instant Delivery</div>
              <div className="text-body-small text-black-alpha-48">Sent to your email in minutes</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
