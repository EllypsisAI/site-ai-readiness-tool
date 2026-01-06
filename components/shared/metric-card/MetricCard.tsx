'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface MetricCardProps {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  status: 'pending' | 'checking' | 'pass' | 'fail' | 'warning';
  score?: number;
  details?: string;
  recommendation?: string;
  actionItems?: string[];
  isAI?: boolean;
  onClick?: () => void;
  isExpanded?: boolean;
}

export function MetricCard({
  id,
  label,
  description,
  icon: Icon,
  status,
  score = 0,
  details,
  recommendation,
  actionItems,
  isAI = false,
  onClick,
  isExpanded = false,
}: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'pass':
        return 'border-accent-success bg-accent-success/5';
      case 'warning':
        return 'border-accent-warning bg-accent-warning/5';
      case 'fail':
        return 'border-accent-danger bg-accent-danger/5';
      case 'checking':
        return 'border-accent-amber bg-accent-amber/5 animate-pulse';
      default:
        return 'border-border-default bg-background-secondary';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pass':
        return <span className="text-accent-success font-bold">✓</span>;
      case 'warning':
        return <span className="text-accent-warning font-bold">⚠</span>;
      case 'fail':
        return <span className="text-accent-danger font-bold">✗</span>;
      case 'checking':
        return <span className="text-accent-amber animate-pulse">⚙</span>;
      default:
        return <span className="text-foreground-tertiary">○</span>;
    }
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'PASS';
    if (score >= 50) return 'WARN';
    return 'FAIL';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        relative border-2 rounded-sm overflow-hidden
        transition-all duration-200
        ${getStatusColor()}
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}
        ${isExpanded ? 'ring-2 ring-accent-amber' : ''}
      `}
      onClick={onClick}
    >
      {/* AI Badge */}
      {isAI && (
        <div className="absolute top-2 right-2 bg-accent-amber text-foreground-inverse text-[10px] font-mono font-bold px-2 py-0.5 rounded">
          AI
        </div>
      )}

      {/* Card Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`
            p-2 rounded-sm flex-shrink-0
            ${status === 'pass' ? 'bg-accent-success/10 text-accent-success' : ''}
            ${status === 'warning' ? 'bg-accent-warning/10 text-accent-warning' : ''}
            ${status === 'fail' ? 'bg-accent-danger/10 text-accent-danger' : ''}
            ${status === 'checking' ? 'bg-accent-amber/10 text-accent-amber' : ''}
            ${status === 'pending' ? 'bg-background-tertiary text-foreground-tertiary' : ''}
          `}>
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-mono text-sm font-semibold text-foreground-primary truncate">
                {label}
              </h3>
              {status !== 'pending' && status !== 'checking' && (
                <div className="flex items-center gap-1.5">
                  {getStatusIcon()}
                  <span className="font-mono text-xs font-bold text-foreground-secondary">
                    {score}/100
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-foreground-tertiary mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Score Bar */}
        {status !== 'pending' && status !== 'checking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1.5"
          >
            <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
              <motion.div
                className={`
                  h-full rounded-full
                  ${status === 'pass' ? 'bg-accent-success' : ''}
                  ${status === 'warning' ? 'bg-accent-warning' : ''}
                  ${status === 'fail' ? 'bg-accent-danger' : ''}
                `}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className={`
                text-[10px] font-mono font-bold uppercase tracking-wide
                ${status === 'pass' ? 'text-accent-success' : ''}
                ${status === 'warning' ? 'text-accent-warning' : ''}
                ${status === 'fail' ? 'text-accent-danger' : ''}
              `}>
                {getScoreLabel()}
              </span>
              {onClick && (
                <span className="text-[10px] text-foreground-tertiary font-mono">
                  {isExpanded ? '▲ Collapse' : '▼ Expand'}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {status === 'checking' && (
          <div className="flex items-center gap-2 text-xs text-accent-amber mt-2">
            <span className="animate-pulse">⚙</span>
            <span className="font-mono">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && details && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t-2 border-current overflow-hidden"
          >
            <div className="p-4 bg-background-code space-y-4">
              {/* Details */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-foreground-tertiary mb-1.5">
                  Analysis
                </div>
                <p className="text-sm text-foreground-secondary font-sans leading-relaxed">
                  {details}
                </p>
              </div>

              {/* Recommendation */}
              {recommendation && (
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-accent-amber mb-1.5">
                    → Recommendation
                  </div>
                  <p className="text-sm text-foreground-primary font-sans leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              )}

              {/* Action Items */}
              {actionItems && actionItems.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-foreground-tertiary mb-2">
                    Action Items
                  </div>
                  <ul className="space-y-2">
                    {actionItems.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-foreground-secondary font-sans"
                      >
                        <span className="text-accent-amber font-mono text-xs mt-0.5">▸</span>
                        <span className="flex-1">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
