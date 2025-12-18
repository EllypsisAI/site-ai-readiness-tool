"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Personalization {
  competitorContext: string;
}

interface Props {
  score: number;
  personalization: Personalization;
  isActive: boolean;
}

// Score distribution data (mock - represents typical sites)
const distribution = [
  { range: "0-20", percent: 15, label: "Poor" },
  { range: "21-40", percent: 25, label: "Below Average" },
  { range: "41-60", percent: 30, label: "Average" },
  { range: "61-80", percent: 20, label: "Good" },
  { range: "81-100", percent: 10, label: "Excellent" },
];

export default function CompetitorContext({ score, personalization, isActive }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Determine which bucket the score falls into
  const getUserBucket = (s: number) => {
    if (s <= 20) return 0;
    if (s <= 40) return 1;
    if (s <= 60) return 2;
    if (s <= 80) return 3;
    return 4;
  };

  const userBucket = getUserBucket(score);

  // Calculate percentile
  const getPercentile = (s: number) => {
    if (s >= 80) return 90;
    if (s >= 60) return 70;
    if (s >= 40) return 40;
    if (s >= 20) return 15;
    return 5;
  };

  const percentile = getPercentile(score);

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-16 lg:px-24 py-80"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-900 mx-auto text-center"
      >
        {/* Headline */}
        <motion.h2
          className="text-title-h1 text-accent-black mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          Where you stand
        </motion.h2>

        <motion.p
          className="text-body-large text-black-alpha-64 mb-48"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          Compared to thousands of sites we've analyzed
        </motion.p>

        {/* Distribution chart */}
        <motion.div
          className="mb-48"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-end justify-center gap-8 h-200 mb-16">
            {distribution.map((bucket, idx) => {
              const isUserBucket = idx === userBucket;
              const height = (bucket.percent / 30) * 100; // Normalize to max height

              return (
                <motion.div
                  key={bucket.range}
                  className="flex flex-col items-center"
                  initial={{ height: 0 }}
                  animate={isInView ? { height: "auto" } : {}}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                >
                  <motion.div
                    className={`w-48 lg:w-64 rounded-t-8 ${
                      isUserBucket
                        ? "bg-heat-100"
                        : "bg-black-alpha-8"
                    }`}
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${height}%` } : {}}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                    style={{ minHeight: 20 }}
                  />
                  {isUserBucket && (
                    <motion.div
                      className="mt-8 px-8 py-4 bg-heat-100 text-white text-label-small rounded-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.3 }}
                    >
                      You
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Labels */}
          <div className="flex justify-center gap-8">
            {distribution.map((bucket) => (
              <div key={bucket.range} className="w-48 lg:w-64 text-center">
                <div className="text-label-small text-black-alpha-48">{bucket.range}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Percentile callout */}
        <motion.div
          className="bg-black-alpha-4 rounded-12 p-24 mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            <div className="text-title-h2 text-accent-black">
              Top {100 - percentile}%
            </div>
            <div className="text-body-large text-black-alpha-64">
              You're ahead of {percentile}% of websites we've analyzed
            </div>
          </div>
        </motion.div>

        {/* Context message */}
        <motion.p
          className="text-body-large text-black-alpha-64 max-w-600 mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
        >
          {personalization.competitorContext}
        </motion.p>
      </motion.div>
    </section>
  );
}
