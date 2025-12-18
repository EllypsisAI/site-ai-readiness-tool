"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Mail, Loader2, Copy, Share2 } from "lucide-react";
import { useUtmParams } from "../hooks/useUtmParams";

interface Personalization {
  ctaMessage: string;
  urgencyLevel: "low" | "medium" | "high";
  domainName: string;
}

interface Props {
  domain: string;
  analysisId?: string | null;
  personalization: Personalization;
  onEmailCapture?: (email: string) => void;
  onCheckout?: () => void;
  isActive: boolean;
}

const valueProps = [
  "40+ specific action items",
  "Code examples you can copy-paste",
  "Prioritized implementation roadmap",
  "Executive summary for stakeholders",
  "Detailed analysis of all 8 metrics",
  "Lifetime access to your report",
];

export default function PricingCTA({
  domain,
  analysisId,
  personalization,
  onEmailCapture,
  onCheckout,
  isActive,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const utmParams = useUtmParams();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Generate shareable link
  const shareableLink = analysisId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/report/${analysisId}`
    : null;

  const copyToClipboard = async () => {
    if (!shareableLink) return;
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (!privacyAccepted) {
      setError("Please accept the privacy policy to continue");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call email capture API with UTM params and consent
      const response = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          analysisId,
          marketingConsent,
          privacyAccepted,
          consentTimestamp: new Date().toISOString(),
          utmParams,
        }),
      });

      if (response.ok) {
        setEmailSubmitted(true);
        onEmailCapture?.(email);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save email");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!analysisId || !email) {
      setError("Please enter your email first");
      return;
    }

    setIsCheckingOut(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        onCheckout?.();
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || "Failed to start checkout");
        setIsCheckingOut(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-16 lg:px-24 py-80"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-600 mx-auto text-center"
      >
        {/* Headline */}
        <motion.h2
          className="text-title-h1 text-accent-black mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {personalization.ctaMessage}
        </motion.h2>

        <motion.p
          className="text-body-large text-black-alpha-64 mb-40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          Get your detailed AI readiness report with specific fixes, code examples, and a
          prioritized action plan.
        </motion.p>

        {/* Pricing card */}
        <motion.div
          className="bg-accent-white border-2 border-accent-black rounded-16 p-32 mb-32 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          {/* Price - placeholder for now */}
          <div className="mb-24">
            <div className="text-label-small text-black-alpha-48 mb-8">One-time payment</div>
            <div className="flex items-baseline justify-center gap-4">
              <span className="text-title-h1 text-accent-black">$49</span>
              <span className="text-body-large text-black-alpha-48 line-through">$99</span>
            </div>
            <div className="text-label-small text-heat-100 mt-8">Launch pricing - 50% off</div>
          </div>

          {/* Value props */}
          <div className="space-y-12 mb-32 text-left">
            {valueProps.map((prop, idx) => (
              <motion.div
                key={prop}
                className="flex items-center gap-12"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8 + idx * 0.05 }}
              >
                <Check className="w-18 h-18 text-accent-black flex-shrink-0" />
                <span className="text-body-large text-accent-black">{prop}</span>
              </motion.div>
            ))}
          </div>

          {/* Email capture or checkout */}
          {!emailSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="space-y-12">
              <div className="relative">
                <Mail className="absolute left-16 top-1/2 -translate-y-1/2 w-18 h-18 text-black-alpha-32" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-48 pr-16 py-14 bg-black-alpha-4 border border-black-alpha-8 rounded-8 text-body-large placeholder:text-black-alpha-32 focus:outline-none focus:border-accent-black transition-colors"
                />
              </div>
              {/* Consent checkboxes */}
              <div className="space-y-10 text-left">
                <label className="flex items-start gap-10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-2 w-16 h-16 rounded border-black-alpha-16 text-accent-black focus:ring-accent-black"
                  />
                  <span className="text-body-small text-black-alpha-64">
                    I agree to the{" "}
                    <a href="/privacy" target="_blank" className="underline hover:text-accent-black">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms" target="_blank" className="underline hover:text-accent-black">
                      Terms of Service
                    </a>
                    <span className="text-heat-200">*</span>
                  </span>
                </label>
                <label className="flex items-start gap-10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-2 w-16 h-16 rounded border-black-alpha-16 text-accent-black focus:ring-accent-black"
                  />
                  <span className="text-body-small text-black-alpha-64">
                    Send me tips on improving my AI readiness (optional)
                  </span>
                </label>
              </div>

              {error && (
                <div className="text-body-small text-heat-200">{error}</div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !privacyAccepted}
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-large font-medium transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-18 h-18 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Get My Report
                    <ArrowRight className="w-18 h-18" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-20">
              {/* Success message */}
              <div className="flex items-center justify-center gap-8 text-accent-black">
                <Check className="w-20 h-20" />
                <span className="text-label-large">Email saved!</span>
              </div>

              {/* Shareable link - unlocked after email */}
              {shareableLink && (
                <div className="bg-black-alpha-4 rounded-12 p-16">
                  <div className="flex items-center gap-8 mb-12">
                    <Share2 className="w-16 h-16 text-accent-black" />
                    <span className="text-label-medium text-accent-black">Share your results</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex-1 bg-accent-white border border-black-alpha-8 rounded-8 px-12 py-10 text-body-small text-black-alpha-64 truncate">
                      {shareableLink}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-6 px-12 py-10 bg-accent-white border border-black-alpha-8 hover:bg-black-alpha-4 rounded-8 text-label-small transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-14 h-14 text-accent-black" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-14 h-14" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-large font-medium transition-all disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-18 h-18 animate-spin" />
                    Redirecting to payment...
                  </>
                ) : (
                  <>
                    Get Full Report
                    <ArrowRight className="w-18 h-18" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-center gap-16 text-body-small text-black-alpha-48"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <span>Secure payment via Stripe</span>
          <span className="hidden lg:inline">•</span>
          <span>Delivered instantly to your email</span>
          <span className="hidden lg:inline">•</span>
          <span>30-day money-back guarantee</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
