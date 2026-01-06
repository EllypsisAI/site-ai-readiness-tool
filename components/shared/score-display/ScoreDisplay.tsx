'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
  totalChecks?: number;
  passedChecks?: number;
  warningChecks?: number;
  failedChecks?: number;
  url?: string;
}

export function ScoreDisplay({
  score,
  totalChecks = 16,
  passedChecks = 0,
  warningChecks = 0,
  failedChecks = 0,
  url,
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score counter
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(Math.round(score));
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreStatus = () => {
    if (score >= 80) return { label: 'EXCELLENT', color: 'text-accent-success', bg: 'bg-accent-success/10' };
    if (score >= 60) return { label: 'GOOD', color: 'text-accent-success', bg: 'bg-accent-success/10' };
    if (score >= 40) return { label: 'NEEDS WORK', color: 'text-accent-warning', bg: 'bg-accent-warning/10' };
    return { label: 'CRITICAL', color: 'text-accent-danger', bg: 'bg-accent-danger/10' };
  };

  const status = getScoreStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background-secondary border-2 border-border-default rounded-sm p-6 lg:p-8"
    >
      {/* URL */}
      {url && (
        <div className="mb-6 pb-4 border-b border-border-subtle">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-foreground-tertiary mb-1">
            Analyzed Site
          </div>
          <div className="text-sm font-mono text-accent-amber truncate">
            {url}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Large Score */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-foreground-tertiary mb-4">
            AI Visibility Score
          </div>

          <div className="relative">
            {/* Score Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-7xl lg:text-8xl font-mono font-bold text-foreground-primary leading-none mb-2">
                {displayScore}
              </div>
              <div className="text-2xl font-mono text-foreground-tertiary">
                / 100
              </div>
            </motion.div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`mt-4 inline-block px-4 py-2 rounded-sm ${status.bg} border border-current`}
            >
              <span className={`text-xs font-mono font-bold ${status.color} tracking-wider`}>
                {status.label}
              </span>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mt-6">
            <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${status.color.replace('text-', 'bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        </div>

        {/* Right: Breakdown */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-foreground-tertiary mb-2">
            Checks Summary
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-sm">
            <span className="font-mono text-sm text-foreground-secondary">
              Total Checks
            </span>
            <span className="font-mono text-lg font-bold text-foreground-primary">
              {totalChecks}
            </span>
          </div>

          {/* Passed */}
          {passedChecks > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between p-3 bg-accent-success/5 border border-accent-success/20 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-accent-success font-bold">✓</span>
                <span className="font-mono text-sm text-foreground-secondary">
                  Passing
                </span>
              </div>
              <span className="font-mono text-lg font-bold text-accent-success">
                {passedChecks}
              </span>
            </motion.div>
          )}

          {/* Warnings */}
          {warningChecks > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between p-3 bg-accent-warning/5 border border-accent-warning/20 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-accent-warning font-bold">⚠</span>
                <span className="font-mono text-sm text-foreground-secondary">
                  Warnings
                </span>
              </div>
              <span className="font-mono text-lg font-bold text-accent-warning">
                {warningChecks}
              </span>
            </motion.div>
          )}

          {/* Failed */}
          {failedChecks > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-3 bg-accent-danger/5 border border-accent-danger/20 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-accent-danger font-bold">✗</span>
                <span className="font-mono text-sm text-foreground-secondary">
                  Failing
                </span>
              </div>
              <span className="font-mono text-lg font-bold text-accent-danger">
                {failedChecks}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
