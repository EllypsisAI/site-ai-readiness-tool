"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Mail, Loader2 } from "lucide-react";

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

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call email capture API
      const response = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          analysisId,
          marketingConsent: true,
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

  const handleCheckout = () => {
    onCheckout?.();
    // For now, just show a message - Stripe integration in Phase 4
    alert("Checkout will be available soon! Email saved for early access.");
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
              {error && (
                <div className="text-body-small text-heat-200">{error}</div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
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
            <div className="space-y-16">
              <div className="flex items-center justify-center gap-8 text-accent-black">
                <Check className="w-20 h-20" />
                <span className="text-label-large">Email saved!</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-large font-medium transition-all"
              >
                Continue to Checkout
                <ArrowRight className="w-18 h-18" />
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
