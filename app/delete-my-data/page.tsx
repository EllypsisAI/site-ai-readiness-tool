"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Check, Loader2, AlertTriangle } from "lucide-react";

export default function DeleteMyDataPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to process request");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-base">
      {/* Header */}
      <header className="border-b border-border-faint">
        <div className="max-w-600 mx-auto px-16 py-24">
          <Link href="/" className="text-label-large text-accent-black hover:opacity-70">
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-600 mx-auto px-16 py-48">
        <div className="text-center mb-40">
          <div className="inline-flex p-16 bg-heat-4 rounded-full mb-24">
            <Trash2 className="w-32 h-32 text-heat-200" />
          </div>
          <h1 className="text-title-h1 text-accent-black mb-16">Delete My Data</h1>
          <p className="text-body-large text-black-alpha-64">
            Request deletion of all personal data associated with your email address.
          </p>
        </div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-white border border-black-alpha-8 rounded-16 p-32"
          >
            {/* Warning */}
            <div className="flex items-start gap-12 p-16 bg-heat-4 rounded-12 mb-24">
              <AlertTriangle className="w-20 h-20 text-heat-200 flex-shrink-0 mt-2" />
              <div className="text-body-small text-black-alpha-64">
                <strong className="text-accent-black">This action is permanent.</strong> We will delete all data associated with your email address, including analysis results, reports, and lead information.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-20">
              <div>
                <label className="block text-label-medium text-accent-black mb-8">
                  Email Address <span className="text-heat-200">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email you used"
                  className="w-full px-16 py-14 bg-black-alpha-4 border border-black-alpha-8 rounded-8 text-body-large placeholder:text-black-alpha-32 focus:outline-none focus:border-accent-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-label-medium text-accent-black mb-8">
                  Reason (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Help us improve - why are you deleting your data?"
                  rows={3}
                  className="w-full px-16 py-14 bg-black-alpha-4 border border-black-alpha-8 rounded-8 text-body-large placeholder:text-black-alpha-32 focus:outline-none focus:border-accent-black transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="text-body-small text-heat-200">{error}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-heat-200 hover:bg-heat-100 text-white rounded-8 text-label-large font-medium transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-18 h-18 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-18 h-18" />
                    Delete My Data
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-accent-white border border-black-alpha-8 rounded-16 p-32 text-center"
          >
            <div className="inline-flex p-16 bg-black-alpha-4 rounded-full mb-24">
              <Check className="w-32 h-32 text-accent-black" />
            </div>
            <h2 className="text-title-h3 text-accent-black mb-12">Request Received</h2>
            <p className="text-body-large text-black-alpha-64 mb-24">
              If we have any data associated with <strong>{email}</strong>, it has been deleted. You will receive a confirmation email shortly.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-8 px-24 py-12 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-large font-medium transition-all"
            >
              Return Home
            </Link>
          </motion.div>
        )}

        {/* Additional info */}
        <div className="mt-32 text-center text-body-small text-black-alpha-48">
          <p className="mb-8">
            Questions? Contact us at{" "}
            <a href="mailto:privacy@ellypsis.ai" className="underline hover:text-accent-black">
              privacy@ellypsis.ai
            </a>
          </p>
          <p>
            Learn more in our{" "}
            <Link href="/privacy" className="underline hover:text-accent-black">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
