import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, X } from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatPrice, calculatePlatformFee } from '../../lib/utils';
import { Button } from '../ui/Button';

export function CartSidebar() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateCartItemQuantity,
    isAuthenticated
  } = useStore();

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const platformFee = calculatePlatformFee(subtotal);
  const total = subtotal + platformFee;

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card-light dark:bg-card-dark shadow-xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-lg font-semibold text-primary-light dark:text-primary-dark flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-secondary-light/30 dark:text-secondary-dark/30 mb-4" />
              <p className="text-secondary-light dark:text-secondary-dark mb-4">
                Your cart is empty
              </p>
              <Button variant="secondary" onClick={() => { closeCart(); navigate('/collections'); }}>
                Start Exploring
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg bg-background-light dark:bg-background-dark"
                >
                  <img
                    src={item.product.primary_image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-primary-light dark:text-primary-dark truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">
                      Size: {item.size}
                    </p>
                    <p className="text-sm font-medium text-accent mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartItemQuantity(item.product_id, item.quantity - 1)}
                        className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(item.product_id, item.quantity + 1)}
                        className="p-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                        disabled={item.quantity >= item.product.quantity_available}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="self-start p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-light dark:text-secondary-dark">Subtotal</span>
                <span className="text-primary-light dark:text-primary-dark">{formatPrice(subtotal)}</span>
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
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
            <button
              onClick={closeCart}
              className="w-full mt-2 text-sm text-secondary-light dark:text-secondary-dark hover:text-accent"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}