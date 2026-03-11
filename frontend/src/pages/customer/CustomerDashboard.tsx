import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  Star, 
  TrendingUp, 
  Zap,
  Crown,
  Gift,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { useQuery } from "@tanstack/react-query";
import orderService from "@/services/orderService";
import productService from "@/services/productService";
import wishlistService from "@/services/wishlistService";

const CustomerDashboard = () => {
  const { user } = useAuth();

  // Fetch data with React Query
  const { data: ordersPage, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['myOrders', { size: 5 }],
    queryFn: () => orderService.getMyOrders({ size: 5 }),
  });

  const { data: productsPage, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['recommendedProducts', { size: 6 }],
    queryFn: () => productService.getAll({ size: 6 }),
  });

  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
  });

  // Derived data
  const recentOrdersData = ordersPage?.content || [];
  const recommendedProductsData = productsPage?.content || [];
  const wishlistCount = Array.isArray(wishlistData) ? wishlistData.length : 0;

  const isLoading = ordersLoading || productsLoading || wishlistLoading;
  const hasError = !!(ordersError || productsError);

  const quickStats = [
    {
      title: "Orders This Month",
      value: ordersPage?.totalElements?.toString() || "0",
      change: "Lifetime",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Recommended",
      value: productsPage?.totalElements?.toString() || "0",
      change: "Available to buy",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Wishlist Items",
      value: wishlistCount.toString(),
      change: "Tracked items",
      icon: Heart,
      color: "text-warning",
    },
    {
      title: "Cart Status",
      value: "Active",
      change: "Ready to checkout",
      icon: ShoppingCart,
      color: "text-destructive",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-success-light text-success";
      case "In Transit": return "bg-primary/10 text-primary";
      case "Processing": return "bg-warning-light text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="gradient-hero rounded-2xl p-8 text-white animate-fade-in shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}! 🛍️
              </h1>
              <p className="text-white/80 text-lg mb-6">
                Discover amazing products from top vendors. You have 3 items in your cart!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30" asChild>
                  <Link to="/customer/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Cart
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/customer/browse">
                    <Gift className="mr-2 h-4 w-4" />
                    Browse Deals
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-2xl p-6">
                <Crown className="h-12 w-12 text-yellow-300 mb-2" />
                <p className="text-sm text-white/80">VIP Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover-lift animate-scale-in shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="animate-fade-in shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/customer/orders">
                    View All Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="p-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                  </div>
                ) : hasError ? (
                  <div className="p-8 text-center text-destructive">
                    <p>Failed to load recent orders.</p>
                  </div>
                ) : recentOrdersData.length === 0 ? (
                  <p className="text-muted-foreground p-4">You have no recent orders.</p>
                ) : (
                  recentOrdersData.map((order: any) => (
                    <div key={order.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="text-2xl">📦</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                          <p className="text-sm font-medium mt-1">${order.totalAmount?.toFixed(2) || "0.00"}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Recommended Products */}
            <Card className="animate-slide-up shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-warning" />
                  Recommended
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : hasError ? (
                  <div className="p-8 text-center text-destructive">
                    <p>Failed to load recommended products.</p>
                  </div>
                ) : recommendedProductsData.length === 0 ? (
                  <p className="text-muted-foreground p-4">No products available.</p>
                ) : (
                  recommendedProductsData.map((product: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                      <div className="text-xl">🛍️</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {product.category || 'Deal'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Status: {product.status}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span className="text-xs text-muted-foreground">4.8</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">${product.price?.toFixed(2)}</div>
                    </div>
                  ))
                )}
                <Button className="w-full mt-4" size="sm" asChild>
                  <Link to="/customer/browse">
                    Browse All Products
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-scale-in shadow-elegant">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
                  <CardContent className="space-y-3">
                <Button className="w-full justify-start gradient-primary" size="sm" asChild>
                  <Link to="/customer/wishlist">
                    <Heart className="mr-2 h-4 w-4" />
                    View Wishlist ({wishlistCount})
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/customer/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Track Orders
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/customer/reviews">
                    <Star className="mr-2 h-4 w-4" />
                    Write Reviews
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;