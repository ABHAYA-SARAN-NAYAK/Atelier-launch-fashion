import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui';

export function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                By accessing and using Atelier Launch, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using Atelier Launch's services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                2. Description of Service
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                Atelier Launch is a marketplace platform that connects emerging fashion designers with buyers. The platform enables designers to create limited-edition collection "drops" and buyers to discover and purchase unique fashion items.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                3. User Accounts and Registration
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                To use our services, you must create an account. You agree to provide accurate information and maintain the security of your account. You are responsible for all activities that occur under your account.
              </p>
              <ul className="list-disc list-inside text-secondary-light dark:text-secondary-dark mt-2 space-y-1">
                <li>You must be at least 18 years old to create an account</li>
                <li>You must provide valid identification for designer accounts</li>
                <li>You are responsible for maintaining password confidentiality</li>
                <li>You agree to notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                4. Designer Verification
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                Designer accounts require verification through school enrollment or professional credentials. We reserve the right to verify credentials and suspend or terminate accounts that provide false information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                5. Product Listings and Sales
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                Designers are responsible for accurately describing their products. All sales are final unless there is a legitimate issue with the product. We hold payment until the buyer confirms receipt or the return window expires.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                All content on Atelier Launch, including designs, images, and logos, are the property of their respective owners. Users may not copy, reproduce, or distribute content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                Atelier Launch is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform. We do not guarantee the accuracy of product listings or the quality of items sold.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                8. Termination
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We reserve the right to terminate accounts that violate our terms or for any reason at our sole discretion. Users may terminate their account at any time by contacting support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                10. Contact Information
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark">
                For questions about these terms, please contact us at support@atelierlaunch.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}