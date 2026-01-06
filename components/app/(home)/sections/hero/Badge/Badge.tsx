'use client';

import { motion } from 'framer-motion';

export default function HomeHeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center justify-center gap-2 mb-8 lg:mb-12"
    >
      <span className="text-xs lg:text-sm font-mono text-foreground-tertiary uppercase tracking-wider">
        AiCanSee.me
      </span>
      <div className="w-1 h-1 rounded-full bg-accent-amber"></div>
      <span className="text-xs lg:text-sm font-mono text-accent-amber">
        AI Readiness Analyzer
      </span>
    </motion.div>
  );
}
