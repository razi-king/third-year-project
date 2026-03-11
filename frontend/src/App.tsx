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
import NotFound from "./pages/NotFound";

// Customer
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BrowseProducts from "./pages/customer/BrowseProducts";
import ShoppingCart from "./pages/customer/ShoppingCart";
import Wishlist from "./pages/customer/Wishlist";
import CustomerOrders from "./pages/customer/Orders";
import Reviews from "./pages/customer/Reviews";
import Profile from "./pages/customer/Profile";
import CustomerSettings from "./pages/customer/Settings";
import ProductDetail from "./pages/customer/ProductDetail";

// Vendor
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import VendorOrders from "./pages/vendor/VendorOrders";
import Customers from "./pages/vendor/Customers";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorReviews from "./pages/vendor/Reviews";
import VendorReports from "./pages/vendor/Reports";
import VendorMessages from "./pages/vendor/Messages";
import StoreProfile from "./pages/vendor/StoreProfile";
import VendorSettings from "./pages/vendor/Settings";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Vendors from "./pages/admin/Vendors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminReports from "./pages/admin/Reports";
import Security from "./pages/admin/Security";
import Approvals from "./pages/admin/Approvals";
import Disputes from "./pages/admin/Disputes";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";

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

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role?.toUpperCase() !== role.toUpperCase()) {
    const userRole = user.role?.toUpperCase() || 'CUSTOMER';
    const redirectPath = userRole === 'VENDOR' ? '/vendor/dashboard' : userRole === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Public Route Component
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
    const userRole = user.role?.toUpperCase() || 'CUSTOMER';
    const redirectPath = userRole === 'VENDOR' ? '/vendor/dashboard' : userRole === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/cart" element={<Navigate to="/customer/cart" replace />} />

      {/* Vendor Routes */}
      <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
      <Route path="/vendor/dashboard" element={<ProtectedRoute role="VENDOR"><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor/products" element={<ProtectedRoute role="VENDOR"><VendorProducts /></ProtectedRoute>} />
      <Route path="/vendor/add-product" element={<ProtectedRoute role="VENDOR"><AddProduct /></ProtectedRoute>} />
      <Route path="/vendor/edit-product/:id" element={<ProtectedRoute role="VENDOR"><EditProduct /></ProtectedRoute>} />
      <Route path="/vendor/orders" element={<ProtectedRoute role="VENDOR"><VendorOrders /></ProtectedRoute>} />
      <Route path="/vendor/analytics" element={<ProtectedRoute role="VENDOR"><VendorAnalytics /></ProtectedRoute>} />
      <Route path="/vendor/customers" element={<ProtectedRoute role="VENDOR"><Customers /></ProtectedRoute>} />
      <Route path="/vendor/reviews" element={<ProtectedRoute role="VENDOR"><VendorReviews /></ProtectedRoute>} />
      <Route path="/vendor/reports" element={<ProtectedRoute role="VENDOR"><VendorReports /></ProtectedRoute>} />
      <Route path="/vendor/messages" element={<ProtectedRoute role="VENDOR"><VendorMessages /></ProtectedRoute>} />
      <Route path="/vendor/store-profile" element={<ProtectedRoute role="VENDOR"><StoreProfile /></ProtectedRoute>} />
      <Route path="/vendor/settings" element={<ProtectedRoute role="VENDOR"><VendorSettings /></ProtectedRoute>} />

      {/* Customer Routes */}
      <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="/customer/dashboard" element={<ProtectedRoute role="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/browse" element={<ProtectedRoute role="CUSTOMER"><BrowseProducts /></ProtectedRoute>} />
      <Route path="/customer/product/:id" element={<ProtectedRoute role="CUSTOMER"><ProductDetail /></ProtectedRoute>} />
      <Route path="/customer/cart" element={<ProtectedRoute role="CUSTOMER"><ShoppingCart /></ProtectedRoute>} />
      <Route path="/customer/wishlist" element={<ProtectedRoute role="CUSTOMER"><Wishlist /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute role="CUSTOMER"><CustomerOrders /></ProtectedRoute>} />
      <Route path="/customer/reviews" element={<ProtectedRoute role="CUSTOMER"><Reviews /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute role="CUSTOMER"><Profile /></ProtectedRoute>} />
      <Route path="/customer/settings" element={<ProtectedRoute role="CUSTOMER"><CustomerSettings /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><Users /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute role="ADMIN"><Vendors /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="ADMIN"><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="ADMIN"><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="ADMIN"><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/security" element={<ProtectedRoute role="ADMIN"><Security /></ProtectedRoute>} />
      <Route path="/admin/approvals" element={<ProtectedRoute role="ADMIN"><Approvals /></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute role="ADMIN"><Disputes /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute role="ADMIN"><AdminMessages /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="ADMIN"><AdminSettings /></ProtectedRoute>} />

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
