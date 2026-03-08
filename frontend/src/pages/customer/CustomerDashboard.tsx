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
  ArrowRight,
  Gift,
  Zap,
  Crown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CustomerDashboard = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      title: "Orders This Month",
      value: "8",
      change: "+12%",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Total Spent",
      value: "$2,847",
      change: "+8%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Wishlist Items",
      value: "24",
      change: "+3",
      icon: Heart,
      color: "text-warning",
    },
    {
      title: "Cart Items",
      value: "3",
      change: "Ready to checkout",
      icon: ShoppingCart,
      color: "text-destructive",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      item: "Wireless Headphones",
      vendor: "TechStore Pro",
      status: "Delivered",
      date: "2 days ago",
      amount: "$299",
      image: "🎧"
    },
    {
      id: "ORD-002", 
      item: "Smart Watch",
      vendor: "Gadget World",
      status: "In Transit",
      date: "5 days ago",
      amount: "$199",
      image: "⌚"
    },
    {
      id: "ORD-003",
      item: "Bluetooth Speaker",
      vendor: "AudioTech",
      status: "Processing",
      date: "1 week ago", 
      amount: "$79",
      image: "🔊"
    },
  ];

  const recommendedProducts = [
    {
      name: "Premium Camera Lens",
      vendor: "Photo Pro",
      price: "$599",
      rating: 4.8,
      image: "📷",
      badge: "Trending"
    },
    {
      name: "Gaming Keyboard",
      vendor: "Game Master",
      price: "$149",
      rating: 4.9,
      image: "⌨️",
      badge: "Hot Deal"
    },
    {
      name: "Fitness Tracker",
      vendor: "Health Tech",
      price: "$89",
      rating: 4.7,
      image: "🏃‍♂️",
      badge: "New"
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
                <Button size="lg" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Gift className="mr-2 h-4 w-4" />
                  Browse Deals
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
                <Button variant="outline" size="sm">
                  View All Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="text-2xl">{order.image}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{order.item}</p>
                      <p className="text-sm text-muted-foreground">by {order.vendor}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{order.amount}</p>
                    </div>
                  </div>
                ))}
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
                {recommendedProducts.map((product, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                    <div className="text-xl">{product.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {product.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">by {product.vendor}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{product.price}</div>
                  </div>
                ))}
                <Button className="w-full mt-4" size="sm">
                  Browse All Products
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-scale-in shadow-elegant">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gradient-primary" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  View Wishlist (24)
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Package className="mr-2 h-4 w-4" />
                  Track Orders
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Star className="mr-2 h-4 w-4" />
                  Write Reviews
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