"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2, Mail, FileText, ArrowRight, AlertCircle } from "lucide-react";

type PaymentStatus = "loading" | "success" | "processing" | "error";

interface PurchaseDetails {
  email: string;
  domain: string;
  analysisId: string;
  pdfStatus: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [details, setDetails] = useState<PurchaseDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("No session ID provided");
      return;
    }

    // Verify the session and get details
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setDetails({
            email: data.email,
            domain: data.domain,
            analysisId: data.analysisId,
            pdfStatus: data.pdfStatus || "pending",
          });
          setStatus("success");
        } else if (data.status === "processing") {
          setStatus("processing");
        } else {
          setStatus("error");
          setError(data.error || "Failed to verify payment");
        }
      } catch (err) {
        setStatus("error");
        setError("Failed to verify payment status");
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background-base flex items-center justify-center px-16">
      <div className="max-w-500 w-full">
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-48 h-48 text-accent-black animate-spin mx-auto mb-24" />
            <h1 className="text-title-h2 text-accent-black mb-12">
              Verifying your payment...
            </h1>
            <p className="text-body-large text-black-alpha-64">
              Please wait while we confirm your purchase.
            </p>
          </motion.div>
        )}

        {status === "success" && details && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success icon */}
            <div className="inline-flex p-20 bg-black-alpha-4 rounded-full mb-24">
              <Check className="w-48 h-48 text-accent-black" />
            </div>

            <h1 className="text-title-h1 text-accent-black mb-12">
              Payment Successful!
            </h1>

            <p className="text-body-large text-black-alpha-64 mb-32">
              Thank you for your purchase. Your detailed AI readiness report for{" "}
              <strong className="text-accent-black">{details.domain}</strong> is being
              prepared.
            </p>

            {/* Status card */}
            <div className="bg-accent-white border border-black-alpha-8 rounded-16 p-24 mb-32 text-left">
              <h2 className="text-label-large text-accent-black mb-16">
                What happens next?
              </h2>

              <div className="space-y-16">
                <div className="flex items-start gap-12">
                  <div className="flex-shrink-0 w-24 h-24 bg-accent-black rounded-full flex items-center justify-center">
                    <Check className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <div className="text-label-medium text-accent-black">
                      Payment confirmed
                    </div>
                    <div className="text-body-small text-black-alpha-48">
                      Your payment has been processed
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-12">
                  <div className="flex-shrink-0 w-24 h-24 bg-accent-black rounded-full flex items-center justify-center">
                    {details.pdfStatus === "completed" ? (
                      <Check className="w-14 h-14 text-white" />
                    ) : (
                      <Loader2 className="w-14 h-14 text-white animate-spin" />
                    )}
                  </div>
                  <div>
                    <div className="text-label-medium text-accent-black">
                      {details.pdfStatus === "completed"
                        ? "Report ready"
                        : "Generating your report"}
                    </div>
                    <div className="text-body-small text-black-alpha-48">
                      {details.pdfStatus === "completed"
                        ? "Your PDF report is ready"
                        : "This usually takes 1-2 minutes"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-12">
                  <div className="flex-shrink-0 w-24 h-24 bg-black-alpha-8 rounded-full flex items-center justify-center">
                    <Mail className="w-14 h-14 text-black-alpha-48" />
                  </div>
                  <div>
                    <div className="text-label-medium text-accent-black">
                      Email delivery
                    </div>
                    <div className="text-body-small text-black-alpha-48">
                      We&apos;ll send your report to {details.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-12">
              <Link
                href={`/report/${details.analysisId}`}
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-large font-medium transition-all"
              >
                <FileText className="w-18 h-18" />
                View Your Report
              </Link>

              <Link
                href="/"
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-black-alpha-4 hover:bg-black-alpha-8 text-accent-black rounded-8 text-label-large font-medium transition-all"
              >
                Analyze Another Site
                <ArrowRight className="w-18 h-18" />
              </Link>
            </div>
          </motion.div>
        )}

        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex p-20 bg-black-alpha-4 rounded-full mb-24">
              <Loader2 className="w-48 h-48 text-accent-black animate-spin" />
            </div>

            <h1 className="text-title-h2 text-accent-black mb-12">
              Processing Payment
            </h1>

            <p className="text-body-large text-black-alpha-64 mb-24">
              Your payment is being processed. This page will update automatically.
            </p>

            <p className="text-body-small text-black-alpha-48">
              If this takes more than a minute, please check your email or contact
              support.
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex p-20 bg-heat-4 rounded-full mb-24">
              <AlertCircle className="w-48 h-48 text-heat-200" />
            </div>

            <h1 className="text-title-h2 text-accent-black mb-12">
              Something went wrong
            </h1>

            <p className="text-body-large text-black-alpha-64 mb-24">
              {error || "We couldn't verify your payment. Please contact support."}
            </p>

            <div className="space-y-12">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-large font-medium transition-all"
              >
                Return Home
              </Link>

              <a
                href="mailto:support@ellypsis.ai"
                className="w-full flex items-center justify-center gap-8 px-24 py-14 bg-black-alpha-4 hover:bg-black-alpha-8 text-accent-black rounded-8 text-label-large font-medium transition-all"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-48 text-center text-body-small text-black-alpha-48">
          <p>Questions? Contact us at support@ellypsis.ai</p>
        </div>
      </div>
    </div>
  );
}
