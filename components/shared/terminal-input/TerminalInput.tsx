'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  error?: string | null;
  placeholder?: string;
}

export function TerminalInput({
  onSubmit,
  isLoading = false,
  error = null,
  placeholder = 'https://yourwebsite.com',
}: TerminalInputProps) {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Clear Call-to-Action Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 text-center"
      >
        <h2 className="text-lg lg:text-xl font-sans font-semibold text-foreground-primary mb-1">
          Get Your Free AI Readiness Score
        </h2>
        <p className="text-sm text-foreground-secondary">
          Enter your website URL below to start the analysis
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
      >
        {/* Terminal Window */}
        <div
          className={`
            relative overflow-hidden
            bg-background-code border border-border-default
            rounded-sm shadow-2xl
            transition-all duration-300
            ${isFocused ? 'border-accent-amber shadow-amber-20' : ''}
          `}
          onClick={handleContainerClick}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-background-secondary border-b border-border-subtle">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-accent-danger opacity-60"></div>
              <div className="w-3 h-3 rounded-full bg-accent-warning opacity-60"></div>
              <div className="w-3 h-3 rounded-full bg-accent-success opacity-60"></div>
            </div>
            <span className="ml-auto text-xs font-mono text-foreground-tertiary">
              aicanseeme@analyzer
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Clear instruction */}
              <div className="mb-4 text-foreground-primary font-sans text-sm">
                <span className="text-accent-amber font-semibold">→</span> Enter your website URL to get your AI readiness score
              </div>

              {/* Command Prompt */}
              <div className="flex items-center gap-2 text-foreground-secondary text-xs mb-1">
                <span className="text-accent-amber font-semibold">$</span>
                <span>aicanseeme analyze</span>
              </div>

              {/* Input Line - BIGGER & MORE OBVIOUS */}
              <div className="flex items-center gap-3 bg-background-secondary/50 rounded px-4 py-3 border border-border-default hover:border-accent-amber/50 transition-colors">
                <span className="text-accent-amber text-lg font-bold">&gt;</span>
                <div className="flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className={`
                      flex-1 bg-transparent outline-none
                      text-foreground-primary text-lg placeholder:text-foreground-tertiary/60
                      font-mono
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {!isLoading && isFocused && (
                    <span className="cursor-blink text-accent-amber ml-1 inline-block w-2.5 text-lg">
                      ▊
                    </span>
                  )}
                  {isLoading && (
                    <span className="text-accent-amber animate-pulse ml-2">
                      ...
                    </span>
                  )}
                </div>

                {/* Visual CTA inside input */}
                {!isLoading && !url && (
                  <div className="flex items-center gap-2 text-xs text-foreground-tertiary bg-background-tertiary px-3 py-1.5 rounded">
                    <kbd className="px-1.5 py-0.5 bg-background-primary border border-border-subtle rounded text-[10px] font-mono">
                      Enter
                    </kbd>
                    <span>to analyze</span>
                  </div>
                )}
              </div>

              {/* Example link */}
              {!isLoading && !url && (
                <div className="mt-3 text-xs text-foreground-tertiary">
                  Example: <button
                    type="button"
                    onClick={() => {
                      const exampleUrl = 'https://example.com';
                      setUrl(exampleUrl);
                      inputRef.current?.focus();
                    }}
                    className="text-accent-amber hover:text-accent-gold underline cursor-pointer"
                  >
                    example.com
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1 text-xs text-foreground-secondary"
                >
                  <div className="cli-line" style={{ '--index': 0 } as React.CSSProperties}>
                    <span className="text-accent-success">✓</span> Validating URL...
                  </div>
                  <div className="cli-line" style={{ '--index': 1 } as React.CSSProperties}>
                    <span className="text-accent-success">✓</span> Initiating scan...
                  </div>
                  <div className="cli-line" style={{ '--index': 2 } as React.CSSProperties}>
                    <span className="text-accent-amber">⚙</span> Fetching website content...
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-xs text-accent-danger"
                >
                  <span>✗</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Hidden submit button for form submission */}
              <button type="submit" className="hidden" aria-label="Submit" />
            </form>
          </div>
        </div>

        {/* Glow Effect when Focused */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10 blur-2xl bg-amber-20 rounded-lg"
          />
        )}
      </motion.div>

      {/* Help Text - CLEARER VALUE PROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center space-y-2"
      >
        <p className="text-sm font-sans text-foreground-secondary">
          <span className="text-accent-success font-semibold">✓ FREE</span> •
          <span className="text-foreground-primary font-semibold"> 16 AI readiness checks</span> •
          Results in ~30 seconds
        </p>
        <p className="text-xs text-foreground-tertiary">
          No signup required • Get your score instantly
        </p>
      </motion.div>
    </div>
  );
}
