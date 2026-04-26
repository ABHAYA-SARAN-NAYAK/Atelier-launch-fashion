import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import { Button, Badge, Card, Spinner } from '../../components/ui';
import { ordersApi } from '../../lib/api';
import { useStore } from '../../lib/store';
import { formatPrice, formatDate } from '../../lib/utils';
import type { Order } from '../../types';

export function OrdersPage() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await ordersApi.getByBuyer(user.id);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const statusConfig: Record<string, { icon: React.ReactNode; variant: 'pending' | 'default' | 'success' | 'info' | 'warning'; label: string }> = {
    pending: { icon: <Clock size={16} />, variant: 'pending', label: 'Pending' },
    paid: { icon: <Package size={16} />, variant: 'warning', label: 'Paid' },
    shipped: { icon: <Truck size={16} />, variant: 'info', label: 'Shipped' },
    delivered: { icon: <CheckCircle size={16} />, variant: 'success', label: 'Delivered' },
    cancelled: { icon: <Package size={16} />, variant: 'default', label: 'Cancelled' },
    refunded: { icon: <Package size={16} />, variant: 'default', label: 'Refunded' },
  };

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark mb-2">
            My Orders
          </h1>
          <p className="text-secondary-light dark:text-secondary-dark">
            Track and manage your orders
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border-light dark:border-border-dark">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-accent'
                  : 'text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <Card key={order.id} className="overflow-hidden">
                  {/* Order Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                    <div>
                      <Link 
                        to={`/orders/${order.id}`}
                        className="text-lg font-semibold text-primary-light dark:text-primary-dark hover:text-accent"
                      >
                        Order #{order.id.slice(0, 8)}
                      </Link>
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1">
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <img
                              src={item.product?.primary_image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100'}
                              alt={item.product?.name || 'Product'}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-primary-light dark:text-primary-dark">
                                {item.product?.name || 'Product'}
                              </p>
                              <p className="text-sm text-secondary-light dark:text-secondary-dark">
                                Size: {item.size} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-accent">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-secondary-light dark:text-secondary-dark">
                          {order.status === 'paid' || order.status === 'pending' ? 'Processing...' : 'No item details available'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark">
                    <div>
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto text-secondary-light/30 dark:text-secondary-dark/30 mb-4" />
            <p className="text-secondary-light dark:text-secondary-dark mb-4">
              {orders.length === 0 ? 'You haven\'t placed any orders yet' : 'No orders found matching this filter'}
            </p>
            <Link to="/collections">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}