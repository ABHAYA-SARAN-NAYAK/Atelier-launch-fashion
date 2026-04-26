import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <Link to="/signup">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-4xl font-display font-bold text-primary-light dark:text-primary-dark mb-8">
            Privacy Policy
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                1. Information We Collect
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-secondary-light dark:text-secondary-dark mt-2 space-y-1">
                <li>Account information (name, email, password)</li>
                <li>Profile information (school, graduation year, specialization)</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-secondary-light dark:text-secondary-dark mt-2 space-y-1">
                <li>Provide and improve our services</li>
                <li>Process transactions and send order confirmations</li>
                <li>Verify designer identities and credentials</li>
                <li>Communicate with you about your account and orders</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                3. Information Sharing
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-secondary-light dark:text-secondary-dark mt-2 space-y-1">
                <li>Service providers who help us operate the platform</li>
                <li>Designers (limited to order information for fulfillment)</li>
                <li>Payment processors for transaction handling</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="text-secondary-light dark:text-secondary-dark mt-2">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                4. Data Security
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                5. Cookies and Tracking
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings, but disabling them may limit some functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                6. Your Rights
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-secondary-light dark:text-secondary-dark mt-2 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                Our services are not intended for users under 18. We do not knowingly collect information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We may update this privacy policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                9. Contact Us
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                If you have questions about this privacy policy, please contact us at privacy@atelierlaunch.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}