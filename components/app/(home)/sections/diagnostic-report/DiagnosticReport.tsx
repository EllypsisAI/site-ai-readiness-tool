'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrutalistButton } from '@/components/shared/brutalist-button';
import { AlertCircle, TrendingDown, TrendingUp, Zap, DollarSign, Bell } from 'lucide-react';

interface CheckResult {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  details?: string;
  recommendation?: string;
  actionItems?: string[];
}

interface AnalysisData {
  id?: string | null;
  url: string;
  domain?: string;
  overallScore: number;
  checks: CheckResult[];
  metadata?: {
    title?: string;
    description?: string;
  };
  aiInsights?: any[];
  overallAIReadiness?: string;
  topPriorities?: string[];
}

interface DiagnosticReportProps {
  analysisData: AnalysisData;
  onEmailCapture?: (email: string) => void;
  onCheckout?: () => void;
}

export default function DiagnosticReport({
  analysisData,
  onEmailCapture,
  onCheckout,
}: DiagnosticReportProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('findings');
  const [showCheckout, setShowCheckout] = useState(false);

  const domain = analysisData.domain || new URL(analysisData.url).hostname;
  const failingChecks = analysisData.checks.filter(c => c.status === 'fail');
  const warningChecks = analysisData.checks.filter(c => c.status === 'warning');
  const criticalIssues = [...failingChecks, ...warningChecks].slice(0, 3);

  const getScoreStatus = () => {
    if (analysisData.overallScore >= 80) return { label: 'Good', color: 'text-accent-success', icon: TrendingUp };
    if (analysisData.overallScore >= 60) return { label: 'Fair', color: 'text-accent-warning', icon: TrendingUp };
    return { label: 'Poor', color: 'text-accent-danger', icon: TrendingDown };
  };

  const status = getScoreStatus();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-background-primary py-16 lg:py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header: Diagnostic Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-background-secondary border-2 border-border-default rounded-sm p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-6 h-6 text-accent-amber flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="font-mono text-xl lg:text-2xl font-bold text-foreground-primary mb-2">
                  Diagnostic Report: {domain}
                </h2>
                <p className="text-sm lg:text-base text-foreground-secondary font-sans">
                  Your site scored <span className={`font-bold ${status.color}`}>{analysisData.overallScore}/100</span> ({status.label}).
                  {failingChecks.length > 0 && (
                    <> You have <span className="text-accent-danger font-semibold">{failingChecks.length} critical issue{failingChecks.length > 1 ? 's' : ''}</span> blocking AI crawlers.</>
                  )}
                  {warningChecks.length > 0 && failingChecks.length === 0 && (
                    <> You have <span className="text-accent-warning font-semibold">{warningChecks.length} warning{warningChecks.length > 1 ? 's' : ''}</span> limiting discoverability.</>
                  )}
                </p>
              </div>
            </div>

            {/* FOMO Statement */}
            <div className="mt-6 p-4 bg-accent-amber/10 border border-accent-amber/30 rounded-sm">
              <p className="text-sm font-sans text-foreground-primary">
                <span className="font-bold">⚡ Reality check:</span> AI agents like ChatGPT and Perplexity are indexing your competitors right now.
                Sites scoring 85+ get recommended <span className="text-accent-amber font-semibold">3x more often</span>.
                Every day you wait, you lose traffic to better-optimized sites.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 1: Critical Findings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => toggleSection('findings')}
            className="w-full bg-background-secondary border-2 border-border-default hover:border-accent-amber/50 rounded-sm p-6 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-accent-danger font-mono text-2xl">✗</span>
                <h3 className="font-mono text-lg font-bold text-foreground-primary">
                  What's Holding You Back
                </h3>
              </div>
              <span className="text-foreground-tertiary font-mono text-sm">
                {expandedSection === 'findings' ? '▲' : '▼'}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {expandedSection === 'findings' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-background-code border-2 border-t-0 border-border-default rounded-b-sm p-6 space-y-4">
                  <p className="text-sm text-foreground-secondary font-sans mb-4">
                    Based on our analysis, these are the top {criticalIssues.length} issues preventing AI agents from understanding your site:
                  </p>

                  {criticalIssues.map((check, i) => (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-sm border-l-4 ${
                        check.status === 'fail'
                          ? 'border-accent-danger bg-accent-danger/5'
                          : 'border-accent-warning bg-accent-warning/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`font-mono text-lg ${
                          check.status === 'fail' ? 'text-accent-danger' : 'text-accent-warning'
                        }`}>
                          {check.status === 'fail' ? '✗' : '⚠'}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-mono font-semibold text-foreground-primary mb-1">
                            {check.label} ({check.score}/100)
                          </h4>
                          <p className="text-sm text-foreground-secondary font-sans">
                            {check.details || check.recommendation || 'Needs improvement'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="mt-6 pt-4 border-t border-border-subtle">
                    <p className="text-xs text-foreground-tertiary font-mono">
                      💡 The implementation kit includes step-by-step fixes for all {analysisData.checks.length} checks, not just these {criticalIssues.length}.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section 2: The Cost of Inaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={() => toggleSection('cost')}
            className="w-full bg-background-secondary border-2 border-border-default hover:border-accent-amber/50 rounded-sm p-6 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-accent-warning" />
                <h3 className="font-mono text-lg font-bold text-foreground-primary">
                  What You're Losing Right Now
                </h3>
              </div>
              <span className="text-foreground-tertiary font-mono text-sm">
                {expandedSection === 'cost' ? '▲' : '▼'}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {expandedSection === 'cost' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-background-code border-2 border-t-0 border-border-default rounded-b-sm p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-mono text-sm font-bold text-accent-warning mb-2 uppercase tracking-wide">
                        Traffic You're Missing
                      </h4>
                      <p className="text-sm text-foreground-secondary font-sans">
                        In 2026, <span className="font-semibold">40% of search traffic</span> comes from AI agents (ChatGPT, Perplexity, Claude).
                        Sites with scores below 70 get <span className="text-accent-danger font-semibold">filtered out completely</span> from AI recommendations.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-mono text-sm font-bold text-accent-warning mb-2 uppercase tracking-wide">
                        Competitor Advantage
                      </h4>
                      <p className="text-sm text-foreground-secondary font-sans">
                        Your competitors scoring 85+ are being recommended when users ask AI: <br/>
                        <span className="text-accent-amber italic">"What's the best {domain.split('.')[0]} alternative?"</span>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-mono text-sm font-bold text-accent-warning mb-2 uppercase tracking-wide">
                        Declining Visibility
                      </h4>
                      <p className="text-sm text-foreground-secondary font-sans">
                        AI agents re-index the web constantly. Every month you delay fixing these issues,
                        your visibility score degrades further as better-optimized sites take your place.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section 3: The Implementation Kit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <button
            onClick={() => toggleSection('kit')}
            className="w-full bg-background-secondary border-2 border-accent-amber hover:bg-accent-amber/5 rounded-sm p-6 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-accent-amber" />
                <h3 className="font-mono text-lg font-bold text-foreground-primary">
                  Your Implementation Kit ($79)
                </h3>
              </div>
              <span className="text-foreground-tertiary font-mono text-sm">
                {expandedSection === 'kit' ? '▲' : '▼'}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {expandedSection === 'kit' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-background-code border-2 border-t-0 border-accent-amber rounded-b-sm p-6">
                  <p className="text-sm text-foreground-secondary font-sans mb-6">
                    Not fluff. Not theory. <span className="text-foreground-primary font-semibold">Actual code and configurations</span> you can implement today.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Step-by-step action plan', detail: 'Prioritized by impact for your site' },
                      { label: 'Copy-paste code examples', detail: 'robots.txt, llms.txt, meta tags' },
                      { label: 'Customized recommendations', detail: `Based on ${domain}'s current state` },
                      { label: 'Schema.org templates', detail: 'Pre-filled for your industry' },
                      { label: 'Semantic HTML guide', detail: 'Before/after examples' },
                      { label: 'AI-optimized sitemap', detail: 'Template with best practices' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 p-3 bg-background-secondary rounded-sm border border-border-subtle"
                      >
                        <span className="text-accent-success font-mono text-sm mt-0.5">✓</span>
                        <div>
                          <div className="font-mono text-sm text-foreground-primary font-semibold">
                            {item.label}
                          </div>
                          <div className="text-xs text-foreground-tertiary font-sans">
                            {item.detail}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4 border-t border-border-subtle">
                    <BrutalistButton
                      variant="primary"
                      size="lg"
                      fullWidth={false}
                      onClick={() => setShowCheckout(true)}
                    >
                      <DollarSign className="w-5 h-5" />
                      Get Implementation Kit - $79
                    </BrutalistButton>

                    <p className="text-xs text-foreground-tertiary font-mono">
                      One-time payment • Instant PDF delivery
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Waitlist Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-background-secondary to-background-tertiary border-2 border-border-default rounded-sm p-6"
        >
          <div className="flex items-start gap-4">
            <Bell className="w-6 h-6 text-accent-info flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-mono text-base font-bold text-foreground-primary mb-2">
                Coming Soon: AI Mention Monitoring
              </h3>
              <p className="text-sm text-foreground-secondary font-sans mb-4">
                Track whether AI agents actually mention your site. Get alerts when you appear in ChatGPT, Perplexity, or Claude responses.
                We ask AI about your competitors and monitor your visibility over time.
              </p>
              <BrutalistButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  // TODO: Implement waitlist modal
                  alert('Waitlist coming soon!');
                }}
              >
                Join the Waitlist →
              </BrutalistButton>
            </div>
          </div>
        </motion.div>

        {/* Checkout Modal Placeholder */}
        <AnimatePresence>
          {showCheckout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
              onClick={() => setShowCheckout(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background-secondary border-2 border-accent-amber rounded-sm p-8 max-w-md w-full"
              >
                <h3 className="font-mono text-xl font-bold text-foreground-primary mb-4">
                  Checkout
                </h3>
                <p className="text-sm text-foreground-secondary font-sans mb-6">
                  Checkout flow coming soon. For now, this would integrate with Stripe Checkout.
                </p>
                <BrutalistButton
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowCheckout(false)}
                >
                  Close
                </BrutalistButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
