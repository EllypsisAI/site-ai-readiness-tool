'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface CLILine {
  id: string;
  text: string;
  status?: 'success' | 'error' | 'info' | 'loading';
  timestamp?: string;
}

interface CLIOutputProps {
  lines: CLILine[];
  title?: string;
  showTimestamps?: boolean;
  maxHeight?: string;
  className?: string;
}

export function CLIOutput({
  lines,
  title,
  showTimestamps = true,
  maxHeight = '400px',
  className = '',
}: CLIOutputProps) {
  const [displayedLines, setDisplayedLines] = useState<CLILine[]>([]);

  useEffect(() => {
    // Stagger the display of lines
    if (lines.length > displayedLines.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(lines.slice(0, displayedLines.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    } else if (lines.length < displayedLines.length) {
      // Reset if lines array shrinks
      setDisplayedLines(lines);
    }
  }, [lines, displayedLines.length]);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <span className="text-accent-success">✓</span>;
      case 'error':
        return <span className="text-accent-danger">✗</span>;
      case 'loading':
        return <span className="text-accent-amber animate-pulse">⚙</span>;
      case 'info':
        return <span className="text-accent-info">ℹ</span>;
      default:
        return <span className="text-foreground-tertiary">•</span>;
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp || !showTimestamps) return null;
    return (
      <span className="text-foreground-tertiary text-xs">
        [{timestamp}]
      </span>
    );
  };

  return (
    <div className={`bg-background-code border border-border-default rounded-sm overflow-hidden ${className}`}>
      {/* Terminal Header */}
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary border-b border-border-subtle">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-danger opacity-60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-accent-warning opacity-60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-accent-success opacity-60"></div>
          </div>
          <span className="ml-2 text-xs font-mono text-foreground-secondary">
            {title}
          </span>
        </div>
      )}

      {/* Output Lines */}
      <div
        className="p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent"
        style={{ maxHeight }}
      >
        {displayedLines.length === 0 ? (
          <div className="text-foreground-tertiary">
            <span className="cursor-blink inline-block">▊</span>
          </div>
        ) : (
          <div className="space-y-1">
            {displayedLines.map((line, index) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="flex items-start gap-2"
              >
                {formatTimestamp(line.timestamp)}
                {getStatusIcon(line.status)}
                <span className={`
                  ${line.status === 'error' ? 'text-accent-danger' : ''}
                  ${line.status === 'success' ? 'text-foreground-primary' : ''}
                  ${line.status === 'loading' ? 'text-accent-amber' : ''}
                  ${!line.status ? 'text-foreground-secondary' : ''}
                `}>
                  {line.text}
                </span>
              </motion.div>
            ))}

            {/* Blinking cursor at the end */}
            {displayedLines.length > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: displayedLines.length * 0.05 }}
                className="cursor-blink text-accent-amber inline-block ml-4"
              >
                ▊
              </motion.span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Utility function to generate timestamp
export function generateTimestamp(): string {
  const now = new Date();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Example usage helper
export function createCLILine(
  text: string,
  status?: CLILine['status'],
  id?: string
): CLILine {
  return {
    id: id || `line-${Date.now()}-${Math.random()}`,
    text,
    status,
    timestamp: generateTimestamp(),
  };
}
