import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Readiness Analysis",
  description: "How we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-title-h1 text-accent-black mb-24">Privacy Policy</h1>
        <p className="text-body-large text-black-alpha-64 mb-40">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-lg max-w-none space-y-32">
          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">1. Introduction</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI Readiness Analysis service. We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR) and Danish data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">2. Data Controller</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              The data controller responsible for your personal data is EllypsisAI. For any questions about this policy or your data, contact us at: <a href="mailto:privacy@ellypsis.ai" className="underline hover:text-accent-black">privacy@ellypsis.ai</a>
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">3. Data We Collect</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">We collect the following types of data:</p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li><strong>Website URLs:</strong> The URLs you submit for analysis</li>
              <li><strong>Email address:</strong> When you choose to save your results or purchase a report</li>
              <li><strong>Analysis results:</strong> The AI readiness scores and metrics we generate</li>
              <li><strong>Usage data:</strong> How you interact with our service (pages visited, features used)</li>
              <li><strong>Marketing preferences:</strong> Your consent choices for communications</li>
              <li><strong>Attribution data:</strong> Referral source and UTM parameters</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">4. How We Use Your Data</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">We use your data for:</p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li>Providing the AI readiness analysis service</li>
              <li>Generating and delivering your reports</li>
              <li>Processing payments (via Stripe)</li>
              <li>Sending transactional emails about your analysis</li>
              <li>Sending marketing communications (only with your explicit consent)</li>
              <li>Improving our service and developing new features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">5. Legal Basis for Processing</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">Under GDPR, we process your data based on:</p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li><strong>Contract:</strong> To provide the service you requested</li>
              <li><strong>Consent:</strong> For marketing communications and optional features</li>
              <li><strong>Legitimate interest:</strong> To improve our service and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">6. Data Sharing</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">We share your data only with:</p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li><strong>Stripe:</strong> For payment processing</li>
              <li><strong>Supabase:</strong> For secure data storage (EU servers)</li>
              <li><strong>Email providers:</strong> To send transactional and marketing emails</li>
            </ul>
            <p className="text-body-large text-black-alpha-64 mt-12">
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">7. Data Retention</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              We retain your data for as long as necessary to provide our services:
            </p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li>Analysis data: 2 years from creation</li>
              <li>Account data: Until you request deletion</li>
              <li>Transaction records: 5 years (legal requirement)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">8. Your Rights</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-24 space-y-8 text-body-large text-black-alpha-64">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Object:</strong> Object to processing based on legitimate interest</li>
              <li><strong>Withdraw consent:</strong> At any time for consent-based processing</li>
            </ul>
            <p className="text-body-large text-black-alpha-64 mt-12">
              To exercise these rights, email us at <a href="mailto:privacy@ellypsis.ai" className="underline hover:text-accent-black">privacy@ellypsis.ai</a> or use our{" "}
              <Link href="/delete-my-data" className="underline hover:text-accent-black">
                data deletion request form
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">9. Cookies</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              We use essential cookies to make our service work. We also use analytics cookies with your consent to understand how you use our service. You can manage your cookie preferences at any time.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">10. Security</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              We implement appropriate technical and organizational measures to protect your data, including encryption in transit and at rest, secure hosting, and regular security reviews.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">11. Changes to This Policy</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through a notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-title-h3 text-accent-black mb-16">12. Contact & Complaints</h2>
            <p className="text-body-large text-black-alpha-64 mb-12">
              For questions or complaints, contact us at <a href="mailto:privacy@ellypsis.ai" className="underline hover:text-accent-black">privacy@ellypsis.ai</a>
            </p>
            <p className="text-body-large text-black-alpha-64">
              You also have the right to lodge a complaint with the Danish Data Protection Agency (Datatilsynet) at <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-black">www.datatilsynet.dk</a>
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
