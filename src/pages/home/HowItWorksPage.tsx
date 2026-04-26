import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Sparkles, Shield, GraduationCap, TrendingUp } from 'lucide-react';
import { Button, Card } from '../../components/ui';

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero */}
      <section className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-primary-light dark:text-primary-dark mb-4">
            How Atelier Launch Works
          </h1>
          <p className="text-xl text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto">
            The complete guide to buying and selling on the world's first fashion student marketplace.
          </p>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-full bg-cta/10 flex items-center justify-center">
              <ShoppingBag className="text-cta" size={24} />
            </div>
            <h2 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark">
              For Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search size={32} />,
                title: 'Discover',
                description: 'Browse limited-edition 72-hour collection drops from verified fashion students at top schools worldwide.',
              },
              {
                icon: <Heart size={32} />,
                title: 'Connect',
                description: 'Follow your favorite designers to get notified when they release new collections and get early access.',
              },
              {
                icon: <Sparkles size={32} />,
                title: 'Own',
                description: 'Purchase unique pieces with stories. Every purchase supports emerging talent and sustainable fashion.',
              },
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-secondary-light dark:text-secondary-dark">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Designers */}
      <section className="py-20 bg-card-light dark:bg-card-dark">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <GraduationCap className="text-accent" size={24} />
            </div>
            <h2 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark">
              For Designers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={32} />,
                title: 'Verify',
                description: 'Sign up with your school email and student ID to get verified. Verified designers display a badge.',
              },
              {
                icon: <Sparkles size={32} />,
                title: 'Create',
                description: 'Create collections with up to 20 products. Set your drop dates and prices. Publish when ready.',
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Grow',
                description: 'Get real sales data, analytics, and customer feedback. Build your brand before graduation.',
              },
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-secondary-light dark:text-secondary-dark">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/signup?type=designer">
              <Button size="lg">Apply as Designer</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-display font-semibold text-center text-primary-light dark:text-primary-dark mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'How does the 72-hour drop work?',
                a: 'Each collection is available for purchase for exactly 72 hours. After the drop ends, the collection is no longer available, making each piece truly limited edition.',
              },
              {
                q: 'What if something is wrong with my order?',
                a: 'We offer a 30-day return policy. If there\'s any issue with your purchase, contact us and we\'ll work with the designer to make it right.',
              },
              {
                q: 'How do I know designers are verified students?',
                a: 'All designers go through a verification process where they submit their school enrollment documents. Verified designers display a green checkmark badge.',
              },
              {
                q: 'What happens to my data?',
                a: 'We take privacy seriously. Your data is encrypted and we never share your information with third parties. You can delete your account anytime.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-2">
                  {faq.q}
                </h3>
                <p className="text-secondary-light dark:text-secondary-dark">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of fashion-forward buyers and emerging designers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/collections">
              <Button className="bg-white text-accent hover:bg-white/90">
                Explore Collections
              </Button>
            </Link>
            <Link to="/signup?type=designer">
              <Button variant="secondary" className="border-white text-white hover:bg-white hover:text-accent">
                Apply as Designer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}