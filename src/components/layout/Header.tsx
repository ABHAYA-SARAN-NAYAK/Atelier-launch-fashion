import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../lib/store';
import { Button } from '../ui/Button';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { cartItems, openCart, isAuthenticated, logout } = useStore();

  const navLinks = [
    { href: '/collections', label: 'Collections' },
    { href: '/designers', label: 'Designers' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.jpg" alt="Atelier Launch" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent',
                  isActive(link.href) ? 'text-accent' : 'text-secondary-light dark:text-secondary-dark'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className={cn(
            'hidden md:block relative transition-all duration-300',
            isSearchFocused ? 'w-80' : 'w-64'
          )}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light dark:text-secondary-dark" size={16} />
            <input
              type="text"
              placeholder="Search collections, designers..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">


            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-cta text-white text-xs font-medium rounded-full">
                  {cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-card-light dark:bg-card-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-primary-light dark:text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-primary-light dark:text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-light dark:border-border-dark">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'text-base font-medium',
                    isActive(link.href) ? 'text-accent' : 'text-primary-light dark:text-primary-dark'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                {!isAuthenticated && (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Sign In</Button>
                  </Link>
                )}
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}