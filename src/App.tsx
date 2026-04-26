import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/layout';
import { HomePage } from './pages/home/HomePage';
import { HowItWorksPage } from './pages/home/HowItWorksPage';
import { CollectionsPage } from './pages/collections/CollectionsPage';
import { CollectionDetailPage } from './pages/collections/CollectionDetailPage';
import { CollectionCreatePage } from './pages/collections/CollectionCreatePage';
import { CollectionEditPage } from './pages/collections/CollectionEditPage';
import { DesignersPage } from './pages/designers/DesignersPage';
import { DesignerProfilePage } from './pages/designers/DesignerProfilePage';
import { ProductDetailPage } from './pages/products/ProductDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { OrderConfirmationPage } from './pages/orders/OrderConfirmationPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { TermsPage } from './pages/legal/TermsPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { useStore } from './lib/store';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function DesignerRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, designerProfile } = useStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!designerProfile) {
    return <Navigate to="/signup?type=designer" replace />;
  }
  return <>{children}</>;
}

function App() {
  const { checkAuth, isLoading } = useStore();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/create" element={
            <DesignerRoute>
              <CollectionCreatePage />
            </DesignerRoute>
          } />
          <Route path="collections/:id/edit" element={
            <DesignerRoute>
              <CollectionEditPage />
            </DesignerRoute>
          } />
          <Route path="collections/:id" element={<CollectionDetailPage />} />
          <Route path="designers" element={<DesignersPage />} />
          <Route path="designers/:id" element={<DesignerProfilePage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          
          {/* Protected user routes */}
          <Route path="orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="orders/:orderId" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="order-confirmation/:orderId" element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected checkout */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />

        {/* Designer routes were moved into Layout above */}

        {/* Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/:tab" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Legal pages */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;