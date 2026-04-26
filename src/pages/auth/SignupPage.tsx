import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { Button, Select } from '../../components/ui';
import { FASHION_SCHOOLS, SPECIALIZATIONS } from '../../types';
import { useStore } from '../../lib/store';
import { useState } from 'react';

const signupSchema = z.object({
  userType: z.enum(['buyer', 'designer']),
  school: z.string().optional(),
  graduationYear: z.string().optional(),
  specialization: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).superRefine((data, ctx) => {
  if (data.userType === 'designer') {
    if (!data.school) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'School is required', path: ['school'] });
    }
    if (!data.graduationYear) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Graduation year is required', path: ['graduationYear'] });
    }
    if (!data.specialization) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Specialization is required', path: ['specialization'] });
    }
  }
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, isLoading } = useStore();
  const userTypeFromUrl = searchParams.get('type') === 'designer' ? 'designer' : 'buyer';

  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: userTypeFromUrl === 'designer' ? 'designer' : 'buyer',
      acceptTerms: false,
    },
  });

  const userType = watch('userType');

  const onSubmit = async (data: SignupForm) => {
    setError('');
    try {
      // Save their choices to local storage before leaving the app
      localStorage.setItem('pending_signup', JSON.stringify(data));
      
      // Trigger Google Auth
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error('Signup failed:', err);
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl font-display font-semibold text-primary-light dark:text-primary-dark">
              Atelier
            </span>
            <span className="text-2xl font-display font-light text-accent">
              Launch
            </span>
          </Link>
          <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark">
            Create your account
          </h1>
          <p className="text-secondary-light dark:text-secondary-dark mt-2">
            {userType === 'designer' 
              ? 'Start selling your fashion designs' 
              : 'Discover unique fashion from emerging designers'}
          </p>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl p-8 border border-border-light dark:border-border-dark">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* User Type Toggle */}
            <div className="flex gap-2 p-1 bg-background-light dark:bg-background-dark rounded-lg">
              <button
                type="button"
                onClick={() => setValue('userType', 'buyer')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'buyer'
                    ? 'bg-card-light dark:bg-card-dark shadow text-primary-light dark:text-primary-dark'
                    : 'text-secondary-light dark:text-secondary-dark'
                }`}
              >
                I'm a Buyer
              </button>
              <button
                type="button"
                onClick={() => setValue('userType', 'designer')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'designer'
                    ? 'bg-card-light dark:bg-card-dark shadow text-primary-light dark:text-primary-dark'
                    : 'text-secondary-light dark:text-secondary-dark'
                }`}
              >
                I'm a Designer
              </button>
            </div>

            {/* Designer-specific fields */}
            {userType === 'designer' && (
              <div className="space-y-4 p-4 bg-accent/5 rounded-lg">
                <Select
                  label="Fashion School"
                  placeholder="Select your school"
                  options={FASHION_SCHOOLS.map(s => ({ value: s, label: s }))}
                  error={errors.school?.message}
                  {...register('school')}
                />

                <Select
                  label="Graduation Year"
                  placeholder="Select year"
                  options={Array.from({ length: 7 }, (_, i) => ({
                    value: String(2024 + i),
                    label: String(2024 + i),
                  }))}
                  error={errors.graduationYear?.message}
                  {...register('graduationYear')}
                />

                <Select
                  label="Specialization"
                  placeholder="Select your focus"
                  options={SPECIALIZATIONS.map(s => ({ value: s, label: s }))}
                  error={errors.specialization?.message}
                  {...register('specialization')}
                />
              </div>
            )}

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 rounded border-border-light dark:border-border-dark"
                {...register('acceptTerms')}
              />
              <span className="text-secondary-light dark:text-secondary-dark">
                I agree to the{' '}
                <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
            )}

            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-200 border border-gray-300 shadow-sm" 
              isLoading={isLoading}
              variant="primary"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Continue with Google
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-light dark:text-secondary-dark">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}