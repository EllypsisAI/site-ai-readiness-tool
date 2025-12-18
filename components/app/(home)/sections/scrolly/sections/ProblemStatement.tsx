"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Search, Globe, MessageSquare } from "lucide-react";

interface Personalization {
  problemStatement: string;
  urgencyLevel: "low" | "medium" | "high";
}

interface Props {
  domain: string;
  personalization: Personalization;
  isActive: boolean;
}

const aiPlatforms = [
  { name: "ChatGPT", icon: MessageSquare, users: "200M+" },
  { name: "Perplexity", icon: Search, users: "10M+" },
  { name: "Claude", icon: Bot, users: "5M+" },
  { name: "Google AI", icon: Globe, users: "1B+" },
];

export default function ProblemStatement({ domain, personalization, isActive }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-16 lg:px-24 py-80 bg-accent-black text-white"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-800 mx-auto text-center"
      >
        {/* Year callout */}
        <motion.div
          className="inline-block px-16 py-8 bg-white-alpha-8 rounded-full mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <span className="text-label-medium text-white-alpha-64">In 2025</span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          className="text-title-h1 mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          AI agents are how customers find you
        </motion.h2>

        {/* Platform grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {aiPlatforms.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={platform.name}
                className="p-20 bg-white-alpha-4 rounded-12 border border-white-alpha-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <Icon className="w-24 h-24 mb-12 mx-auto text-white-alpha-64" />
                <div className="text-label-medium mb-4">{platform.name}</div>
                <div className="text-body-small text-white-alpha-48">{platform.users} users</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Problem statement */}
        <motion.div
          className="bg-white-alpha-4 border border-white-alpha-8 rounded-12 p-24 mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
        >
          <p className="text-body-large text-white-alpha-80">
            {personalization.problemStatement}
          </p>
        </motion.div>

        {/* Stats callout */}
        <motion.div
          className="flex flex-col lg:flex-row justify-center gap-24 lg:gap-48"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.1 }}
        >
          <div className="text-center">
            <div className="text-title-h2 text-heat-100">40%</div>
            <div className="text-body-small text-white-alpha-48">of Google searches now</div>
            <div className="text-body-small text-white-alpha-48">include AI Overviews</div>
          </div>
          <div className="text-center">
            <div className="text-title-h2 text-heat-100">65%</div>
            <div className="text-body-small text-white-alpha-48">of users trust AI</div>
            <div className="text-body-small text-white-alpha-48">recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-title-h2 text-heat-100">3x</div>
            <div className="text-body-small text-white-alpha-48">higher CTR from</div>
            <div className="text-body-small text-white-alpha-48">AI-sourced traffic</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
