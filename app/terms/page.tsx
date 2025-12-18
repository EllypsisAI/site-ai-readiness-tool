import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | AI Readiness Analysis",
  description: "Terms and conditions for using our AI Readiness Analysis service.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background-base">
      {/* Header */}
      <header className="border-b border-border-faint">
        <div className="max-w-800 mx-auto px-16 py-24">
          <Link href="/" className="text-label-large text-accent-black hover:opacity-70">
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-800 mx-auto px-16 py-48">
        <h1 className="text-title-h1 text-accent-black mb-24">Terms of Service</h1>
        <p className="text-body-large text-black-alpha-64 mb-40">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-lg max-w-none space-y-32">
          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">1. Agreement to Terms</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              By accessing or using our AI Readiness Analysis service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">2. Description of Service</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              Our service analyzes websites for AI readiness, providing scores, metrics, and recommendations. We offer:
            </p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li><strong>Free Analysis:</strong> Basic AI readiness score and metrics</li>
              <li><strong>Paid Reports:</strong> Detailed analysis with action items and code examples</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">3. Acceptable Use</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">You agree not to:</p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li>Use the service for any illegal purpose</li>
              <li>Submit URLs to websites you do not own or have permission to analyze</li>
              <li>Attempt to reverse engineer, hack, or disrupt the service</li>
              <li>Use automated tools to excessively access the service</li>
              <li>Resell or redistribute our reports without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">4. Intellectual Property</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              The service, including its design, features, and content, is owned by EllypsisAI. Your purchased reports are licensed for your personal or business use only.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">5. Payment Terms</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              For paid reports:
            </p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li>All payments are processed securely via Stripe</li>
              <li>Prices are in USD unless otherwise stated</li>
              <li>Payment is due at the time of purchase</li>
              <li>We offer a 30-day money-back guarantee if you're not satisfied</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">6. Refund Policy</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              We offer a 30-day money-back guarantee on all paid reports. If you're not satisfied with your report, contact us at <a href="mailto:support@ellypsis.ai" className="underline hover:text-accent-black">support@ellypsis.ai</a> within 30 days of purchase for a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">7. Disclaimer of Warranties</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              The service is provided "as is" without warranties of any kind. We do not guarantee that:
            </p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li>The service will be uninterrupted or error-free</li>
              <li>The analysis results will be 100% accurate</li>
              <li>Following our recommendations will guarantee specific results</li>
            </ul>
            <p className="text-body-large text-black-alpha-64 mt-12">
              Our analysis is based on automated tools and AI models, and should be used as guidance, not as definitive technical advice.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">8. Limitation of Liability</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              To the maximum extent permitted by law, EllypsisAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">9. Changes to Service</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              We reserve the right to modify, suspend, or discontinue the service at any time. We will provide reasonable notice of any significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">10. Changes to Terms</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              We may update these Terms from time to time. We will notify you of material changes via email or through a notice on our website. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">11. Governing Law</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              These Terms are governed by and construed in accordance with the laws of Denmark. Any disputes shall be subject to the exclusive jurisdiction of the Danish courts.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">12. Contact</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              For questions about these Terms, contact us at <a href="mailto:legal@ellypsis.ai" className="underline hover:text-accent-black">legal@ellypsis.ai</a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-faint mt-48">
        <div className="max-w-800 mx-auto px-16 py-24 flex justify-between text-body-small text-black-alpha-48">
          <span>&copy; {new Date().getFullYear()} EllypsisAI</span>
          <div className="flex gap-16">
            <Link href="/privacy" className="hover:text-accent-black">Privacy</Link>
            <Link href="/terms" className="hover:text-accent-black">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
