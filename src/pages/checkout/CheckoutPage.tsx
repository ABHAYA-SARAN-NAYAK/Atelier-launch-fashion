import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Truck, Lock } from 'lucide-react';
import { Button, Input, Select } from '../../components/ui';
import { useStore } from '../../lib/store';
import { formatPrice, calculatePlatformFee } from '../../lib/utils';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zip: z.string().min(5, 'Valid ZIP required'),
  country: z.string().optional(),
  shippingMethod: z.enum(['standard', 'express']),
  saveAddress: z.boolean().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
].map(s => ({ value: s, label: s }));

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'standard',
      saveAddress: true,
    },
  });

  const subtotal = cartItems.reduce((sum: number, item: { product: { price: number }; quantity: number }) => sum + item.product.price * item.quantity, 0);
  const shipping = 0;
  const platformFee = calculatePlatformFee(subtotal);
  const total = subtotal + shipping + platformFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <Link to="/collections">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation/order-123');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
                <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6 flex items-center gap-2">
                  <Truck size={20} />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="123-456-7890"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Input
                    label="Address"
                    placeholder="123 Main St"
                    error={errors.address?.message}
                    {...register('address')}
                  />
                  <Input
                    label="City"
                    placeholder="New York"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Select
                    label="State"
                    options={usStates}
                    placeholder="Select"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                  <Input
                    label="ZIP Code"
                    placeholder="10001"
                    error={errors.zip?.message}
                    {...register('zip')}
                  />
                  <Select
                    label="Country"
                    options={[{ value: 'United States', label: 'United States' }]}
                    {...register('country')}
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
                <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">
                  Shipping Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 rounded-lg border-2 cursor-pointer border-accent bg-accent/5">
                    <input
                      type="radio"
                      value="standard"
                      {...register('shippingMethod')}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-primary-light dark:text-primary-dark">
                        Standard Shipping
                      </p>
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">
                        5-7 business days
                      </p>
                    </div>
                    <span className="text-accent font-medium">Free</span>
                  </label>

                  <label className="flex items-center p-4 rounded-lg border-2 cursor-pointer border-border-light dark:border-border-dark">
                    <input
                      type="radio"
                      value="express"
                      {...register('shippingMethod')}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-primary-light dark:text-primary-dark">
                        Express Shipping
                      </p>
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">
                        2-3 business days
                      </p>
                    </div>
                    <span className="text-primary-light dark:text-primary-dark font-medium">$15</span>
                  </label>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
                <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6 flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment
                </h2>

                <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg mb-4">
                  <p className="text-sm text-secondary-light dark:text-secondary-dark mb-2">
                    Demo Mode - No real payment will be processed
                  </p>
                  <p className="text-xs text-secondary-light dark:text-secondary-dark">
                    Use card number: 4242 4242 4242 4242
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Lock size={16} className="text-accent" />
                  <span className="text-sm text-secondary-light dark:text-secondary-dark">
                    Secure checkout with SSL encryption
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item: { id: string; product: { name: string; price: number; primary_image?: string }; size: string; quantity: number }) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.primary_image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100'}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary-light dark:text-primary-dark truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">
                        Size: {item.size} × {item.quantity}
                      </p>
                      <p className="text-sm text-accent">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border-light dark:border-border-dark pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-light dark:text-secondary-dark">Subtotal</span>
                  <span className="text-primary-light dark:text-primary-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-light dark:text-secondary-dark">Shipping</span>
                  <span className="text-primary-light dark:text-primary-dark">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-light dark:text-secondary-dark">Platform Fee (15%)</span>
                  <span className="text-primary-light dark:text-primary-dark">{formatPrice(platformFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border-light dark:border-border-dark">
                  <span className="text-primary-light dark:text-primary-dark">Total</span>
                  <span className="text-accent">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}