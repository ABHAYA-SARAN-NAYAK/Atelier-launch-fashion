import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, icon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light dark:text-secondary-dark">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : type}
            className={cn(
              'w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-primary-light dark:text-primary-dark placeholder:text-secondary-light/60 dark:placeholder:text-secondary-dark/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200',
              icon && 'pl-10',
              isPassword && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';