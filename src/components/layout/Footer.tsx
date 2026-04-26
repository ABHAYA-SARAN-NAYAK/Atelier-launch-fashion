import { Link } from 'react-router-dom';
import { MapPin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'For Designers', href: '/for-designers' },
      { label: 'Careers', href: '/careers' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-display font-semibold text-primary-light dark:text-primary-dark">
                Atelier
              </span>
              <span className="text-2xl font-display font-light text-accent">
                Launch
              </span>
            </Link>
            <p className="text-secondary-light dark:text-secondary-dark text-sm mb-6 max-w-sm">
              Wear tomorrow's fashion today. Discover unique pieces from emerging designers at the world's first marketplace exclusively for fashion students.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-accent hover:text-white transition-colors"
              >
                IG
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-light dark:text-secondary-dark hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-light dark:text-secondary-dark hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-light dark:text-secondary-dark hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border-light dark:border-border-dark flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-light dark:text-secondary-dark">
            &copy; {currentYear} Atelier Launch. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-secondary-light dark:text-secondary-dark">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              New York, NY
            </span>
            <a href="mailto:hello@atelierlaunch.com" className="flex items-center gap-2 hover:text-accent">
              <Mail size={16} />
              hello@atelierlaunch.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}