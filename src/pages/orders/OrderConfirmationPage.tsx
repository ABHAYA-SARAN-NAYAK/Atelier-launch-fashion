import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Mail } from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { formatPrice } from '../../lib/utils';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  // Mock order data
  const order = {
    orderNumber: orderId || 'ATL-2024-001',
    date: new Date().toISOString(),
    items: [
      { name: 'Asymmetric Wool Blazer', size: 'M', quantity: 1, price: 245, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100', designer: 'Maya Chen' },
    ],
    subtotal: 245,
    shipping: 0,
    platformFee: 37,
    total: 282,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    estimatedDelivery: 'January 22-29, 2024',
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-16">
      <div className="container-custom max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark mb-2">
            Order Confirmed!
          </h1>
          <p className="text-secondary-light dark:text-secondary-dark">
            Thank you for your purchase, Emma
          </p>
          <p className="text-lg font-medium text-primary-light dark:text-primary-dark mt-2">
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Confirmation Email Notice */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm text-secondary-light dark:text-secondary-dark">
          <Mail size={16} />
          <span>Confirmation email sent to your email address</span>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <h2 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">
            Order Details
          </h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-primary-light dark:text-primary-dark">
                    {item.name}
                  </p>
                  <p className="text-sm text-secondary-light dark:text-secondary-dark">
                    Size: {item.size} × {item.quantity}
                  </p>
                  <p className="text-xs text-secondary-light/60 dark:text-secondary-dark/60">
                    By {item.designer}
                  </p>
                </div>
                <p className="font-medium text-accent">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border-light dark:border-border-dark pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary-light dark:text-secondary-dark">Subtotal</span>
              <span className="text-primary-light dark:text-primary-dark">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-light dark:text-secondary-dark">Shipping</span>
              <span className="text-primary-light dark:text-primary-dark">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-light dark:text-secondary-dark">Platform Fee</span>
              <span className="text-primary-light dark:text-primary-dark">{formatPrice(order.platformFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border-light dark:border-border-dark">
              <span className="text-primary-light dark:text-primary-dark">Total</span>
              <span className="text-accent">{formatPrice(order.total)}</span>
            </div>
          </div>
        </Card>

        {/* Shipping Info */}
        <Card className="mb-8">
          <h2 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">
            Shipping Information
          </h2>
          <div className="space-y-2">
            <p className="text-primary-light dark:text-primary-dark">
              {order.shippingAddress.street}
            </p>
            <p className="text-secondary-light dark:text-secondary-dark">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p className="text-secondary-light dark:text-secondary-dark">
              {order.shippingAddress.country}
            </p>
          </div>
          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <p className="text-sm text-accent">
              Estimated delivery: {order.estimatedDelivery}
            </p>
          </div>
        </Card>

        {/* Designer Thank You */}
        {order.items.map((item, index) => (
          <Card key={index} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Package size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-medium text-primary-light dark:text-primary-dark">
                  Your purchase supports {item.designer}
                </p>
                <p className="text-sm text-secondary-light dark:text-secondary-dark">
                  Thank you for supporting emerging fashion talent!
                </p>
              </div>
            </div>
          </Card>
        ))}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button variant="secondary">View Order Details</Button>
          </Link>
          <Link to="/collections">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}