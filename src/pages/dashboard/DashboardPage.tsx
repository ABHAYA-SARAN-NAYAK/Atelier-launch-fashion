import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, DollarSign, Package, Users, ShoppingBag, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Badge, Spinner } from '../../components/ui';
import { CollectionCard } from '../../components/features';
import { collectionsApi, ordersApi } from '../../lib/api';
import { useStore } from '../../lib/store';
import { formatPrice } from '../../lib/utils';
import type { Collection, Order } from '../../types';
import toast from 'react-hot-toast';

type DashboardTab = 'overview' | 'collections' | 'orders' | 'analytics' | 'settings';

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState<DashboardTab>(tabParam as DashboardTab);
  
  const { user, designerProfile, isDesignerVerified } = useStore();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        if (designerProfile) {
          const collectionsData = await collectionsApi.getAll({});
          setCollections(collectionsData.filter(c => c.designer_id === designerProfile.id));
          
          const ordersData = await ordersApi.getByBuyer(user.id);
          setOrders(ordersData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, designerProfile]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as DashboardTab);
    setSearchParams({ tab });
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      await collectionsApi.delete(collectionId);
      setCollections(collections.filter(c => c.id !== collectionId));
      toast.success('Collection deleted');
    } catch (error) {
      console.error('Failed to delete collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'pending').length;
  const liveCollections = collections.filter(c => c.status === 'live').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} /> },
    { id: 'collections', label: 'Collections', icon: <ShoppingBag size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <Eye size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Edit size={18} /> },
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                {designerProfile?.brand_name?.charAt(0) || user?.full_name?.charAt(0) || 'D'}
              </div>
              <div>
                <h1 className="text-2xl font-display font-semibold text-primary-light dark:text-primary-dark">
                  {designerProfile?.brand_name || user?.full_name || 'Designer Dashboard'}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={isDesignerVerified ? 'success' : 'warning'}>
                    {isDesignerVerified ? 'Verified Designer' : 'Pending Verification'}
                  </Badge>
                  {designerProfile?.school_name && (
                    <span className="text-sm text-secondary-light dark:text-secondary-dark">
                      {designerProfile.school_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {designerProfile && (
              <Link to="/collections/create">
                <Button>
                  <Plus size={18} className="mr-2" />
                  New Collection
                </Button>
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 border-b border-border-light dark:border-border-dark overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-accent'
                    : 'text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Total Revenue</p>
                    <p className="text-2xl font-bold text-accent">{formatPrice(totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <DollarSign className="text-accent" size={24} />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Active Collections</p>
                    <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">{liveCollections}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <ShoppingBag className="text-blue-500" size={24} />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Total Orders</p>
                    <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">{orders.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Package className="text-purple-500" size={24} />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Followers</p>
                    <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                      {designerProfile?.follower_count || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Users className="text-green-500" size={24} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Pending Orders Alert */}
            {pendingOrders > 0 && (
              <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10 p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-semibold text-primary-light dark:text-primary-dark">
                      You have {pendingOrders} pending orders
                    </h3>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">
                      {designerProfile ? 'Ship these orders to receive your payouts' : 'Complete checkout to secure your items'}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleTabChange('orders')}>
                    View Orders
                  </Button>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {designerProfile ? (
                    <>
                      <Link to="/collections/create" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus size={18} className="mr-2" />
                          Create New Collection
                        </Button>
                      </Link>
                      <Link to="/profile" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <Edit size={18} className="mr-2" />
                          Update Profile
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link to="/signup?type=designer" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Users size={18} className="mr-2" />
                        Become a Designer
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
                  Recent Orders
                </h3>
                {orders.length > 0 ? (
                  <div className="space-y-2">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between text-sm">
                        <span className="text-primary-light dark:text-primary-dark">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <Badge variant={order.status === 'delivered' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-light dark:text-secondary-dark text-sm">
                    No orders yet
                  </p>
                )}
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                My Collections
              </h2>
              {designerProfile && (
                <Link to="/collections/create">
                  <Button size="sm">
                    <Plus size={16} className="mr-2" />
                    Create Collection
                  </Button>
                </Link>
              )}
            </div>

            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div key={collection.id} className="relative group">
                    <CollectionCard collection={collection} />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge variant={collection.status === 'live' ? 'success' : collection.status === 'ended' ? 'default' : 'warning'}>
                        {collection.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/collections/${collection.id}/edit`}>
                        <Button size="sm" variant="outline" className="bg-black/50 border-white/20 text-white hover:bg-white hover:text-black">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="bg-black/50 border-white/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500" onClick={() => handleDeleteCollection(collection.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag size={48} className="mx-auto mb-4 text-secondary-light dark:text-secondary-dark opacity-50" />
                <p className="text-secondary-light dark:text-secondary-dark mb-4">
                  You haven't created any collections yet
                </p>
                {designerProfile ? (
                  <Link to="/collections/create">
                    <Button>Create Your First Collection</Button>
                  </Link>
                ) : (
                  <Link to="/signup?type=designer">
                    <Button>Become a Designer</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">
              Orders
            </h2>
            {orders.length > 0 ? (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                        <th className="text-left py-3 px-4 text-sm font-medium text-secondary-light dark:text-secondary-dark">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-secondary-light dark:text-secondary-dark">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-secondary-light dark:text-secondary-dark">Items</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-secondary-light dark:text-secondary-dark">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-secondary-light dark:text-secondary-dark">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border-light dark:border-border-dark">
                          <td className="py-3 px-4 text-sm font-medium text-primary-light dark:text-primary-dark">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4 text-sm text-secondary-light dark:text-secondary-dark">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-secondary-light dark:text-secondary-dark">
                            {order.items?.length || 0} items
                          </td>
                          <td className="py-3 px-4 text-sm text-accent font-medium">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              order.status === 'delivered' ? 'success' : 
                              order.status === 'shipped' ? 'info' :
                              order.status === 'paid' ? 'warning' : 'default'
                            }>
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto mb-4 text-secondary-light dark:text-secondary-dark opacity-50" />
                <p className="text-secondary-light dark:text-secondary-dark">No orders yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">
              Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-sm text-secondary-light dark:text-secondary-dark">Lifetime Revenue</p>
                <p className="text-2xl font-bold text-accent">{formatPrice(totalRevenue)}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-secondary-light dark:text-secondary-dark">Avg Order Value</p>
                <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                  {orders.length > 0 ? formatPrice(totalRevenue / orders.length) : formatPrice(0)}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-secondary-light dark:text-secondary-dark">Total Sales</p>
                <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                  {orders.length}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-secondary-light dark:text-secondary-dark">Collection Views</p>
                <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                  {collections.reduce((sum, c) => sum + (c.views || 0), 0)}
                </p>
              </Card>
            </div>
            <Card className="p-8">
              <div className="h-64 flex items-center justify-center text-secondary-light dark:text-secondary-dark">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm mt-2">Track your sales, views, and customer behavior</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-6">
              Settings
            </h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
                  Profile Settings
                </h3>
                <Link to="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </Card>

              {designerProfile && (
                <Card className="p-6">
                  <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
                    Designer Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-light dark:text-primary-dark">Brand Name</p>
                        <p className="text-sm text-secondary-light dark:text-secondary-dark">
                          {designerProfile.brand_name || 'Not set'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-light dark:text-primary-dark">Verification Status</p>
                        <p className="text-sm text-secondary-light dark:text-secondary-dark">
                          {designerProfile.verification_status}
                        </p>
                      </div>
                      <Badge variant={isDesignerVerified ? 'success' : 'warning'}>
                        {designerProfile.verification_status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-4">
                  Account
                </h3>
                <p className="text-sm text-secondary-light dark:text-secondary-dark mb-4">
                  Need to change something? Contact support for help.
                </p>
                <Button variant="outline">Contact Support</Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}