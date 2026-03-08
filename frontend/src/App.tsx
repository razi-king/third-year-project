import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BrowseProducts from "./pages/customer/BrowseProducts";
import ShoppingCart from "./pages/customer/ShoppingCart";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'VENDOR' | 'CUSTOMER' | 'ADMIN' }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="gradient-primary rounded-xl p-4 w-16 h-16 mx-auto mb-4 shadow-glow animate-pulse">
            <div className="w-full h-full rounded-lg bg-white/20"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'VENDOR' ? '/' : user.role === 'ADMIN' ? '/admin' : '/customer';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (only accessible when not logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="gradient-primary rounded-xl p-4 w-16 h-16 mx-auto mb-4 shadow-glow animate-pulse">
            <div className="w-full h-full rounded-lg bg-white/20"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'VENDOR' ? '/' : user.role === 'ADMIN' ? '/admin' : '/customer';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (Login/Register) */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Vendor Routes */}
      <Route path="/" element={
        <ProtectedRoute role="VENDOR">
          <VendorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute role="VENDOR">
          <Products />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute role="VENDOR">
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute role="VENDOR">
          <Analytics />
        </ProtectedRoute>
      } />

      {/* Customer Routes */}
      <Route path="/customer" element={
        <ProtectedRoute role="CUSTOMER">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/browse" element={
        <ProtectedRoute role="CUSTOMER">
          <BrowseProducts />
        </ProtectedRoute>
      } />
      <Route path="/customer/cart" element={
        <ProtectedRoute role="CUSTOMER">
          <ShoppingCart />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute role="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
