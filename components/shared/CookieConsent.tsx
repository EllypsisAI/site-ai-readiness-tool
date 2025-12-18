"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie_consent";

type ConsentState = "pending" | "accepted" | "rejected";

export default function CookieConsent() {
  const [consentState, setConsentState] = useState<ConsentState>("pending");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      setConsentState(stored as ConsentState);
    } else {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsentState("accepted");
    setIsVisible(false);
    // Here you would enable analytics/tracking
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setConsentState("rejected");
    setIsVisible(false);
    // Here you would disable analytics/tracking
  };

  const handleClose = () => {
    // Closing without choice = essential cookies only (same as reject)
    handleReject();
  };

  if (!isVisible || consentState !== "pending") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-[200] p-16 lg:p-24"
      >
        <div className="max-w-900 mx-auto bg-accent-white border border-black-alpha-8 rounded-16 shadow-lg p-20 lg:p-24">
          <div className="flex items-start gap-16">
            {/* Icon */}
            <div className="hidden lg:flex p-12 bg-black-alpha-4 rounded-12">
              <Cookie className="w-24 h-24 text-accent-black" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-label-large font-medium text-accent-black">
                  Cookie Preferences
                </h3>
                <button
                  onClick={handleClose}
                  className="lg:hidden p-4 hover:bg-black-alpha-4 rounded-8 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-18 h-18 text-black-alpha-48" />
                </button>
              </div>

              <p className="text-body-small text-black-alpha-64 mb-16">
                We use essential cookies to make our site work. With your consent, we also use analytics cookies to understand how you use our service and improve it.{" "}
                <Link href="/privacy" className="underline hover:text-accent-black">
                  Learn more
                </Link>
              </p>

              {/* Buttons */}
              <div className="flex flex-col lg:flex-row gap-12">
                <button
                  onClick={handleAccept}
                  className="px-20 py-10 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-medium font-medium transition-all"
                >
                  Accept All
                </button>
                <button
                  onClick={handleReject}
                  className="px-20 py-10 bg-black-alpha-4 hover:bg-black-alpha-8 text-accent-black rounded-8 text-label-medium font-medium transition-all"
                >
                  Essential Only
                </button>
              </div>
            </div>

            {/* Close button - desktop */}
            <button
              onClick={handleClose}
              className="hidden lg:block p-8 hover:bg-black-alpha-4 rounded-8 transition-colors"
              aria-label="Close"
            >
              <X className="w-18 h-18 text-black-alpha-48" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to check consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>("pending");

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      setConsent(stored as ConsentState);
    }
  }, []);

  return consent;
}
