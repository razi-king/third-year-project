import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import analyticsService from "@/services/analyticsService";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Star,
  DollarSign,
  Eye,
  Plus,
  MoreHorizontal,
  Calendar
} from "lucide-react";

const VendorDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['vendorStats'],
    queryFn: () => analyticsService.getDashboardStats(),
  });

  const quickStats = [
    {
      title: "Total Sales",
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0",
      change: stats ? `${stats.revenueChange}%` : "0%",
      trend: stats && stats.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
      gradient: true,
    },
    {
      title: "Products Listed",
      value: stats ? stats.totalProducts.toString() : "0",
      change: "Active",
      trend: "up",
      icon: Package,
    },
    {
      title: "Orders",
      value: stats ? stats.totalOrders.toString() : "0",
      change: stats ? `${stats.ordersChange}%` : "0%",
      trend: stats && stats.ordersChange >= 0 ? "up" : "down",
      icon: ShoppingCart,
    },
    {
      title: "Store Views",
      value: "2,847", // Mocked for now
      change: "+15.3%",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Customer Rating",
      value: "4.8", // Mocked for now
      change: "98% positive",
      trend: "up",
      icon: Star,
    },
    {
      title: "Active Customers",
      value: stats ? stats.totalCustomers.toString() : "0",
      change: "Registered",
      trend: "up",
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: "#12543",
      customer: "Sarah Johnson",
      product: "Wireless Bluetooth Headphones",
      amount: "$89.99",
      status: "Processing",
      date: "2 mins ago",
    },
    {
      id: "#12542",
      customer: "Mike Chen",
      product: "Premium Coffee Beans (2kg)",
      amount: "$45.99",
      status: "Shipped",
      date: "15 mins ago",
    },
    {
      id: "#12541",
      customer: "Emily Davis",
      product: "Organic Face Cream Set",
      amount: "$129.99",
      status: "Delivered",
      date: "1 hour ago",
    },
    {
      id: "#12540",
      customer: "David Wilson",
      product: "Fitness Tracker Pro",
      amount: "$199.99",
      status: "Processing",
      date: "2 hours ago",
    },
  ];

  const topProducts = [
    {
      name: "Wireless Bluetooth Headphones",
      sales: 45,
      revenue: "$4,049.55",
      stock: 23,
      image: "🎧",
    },
    {
      name: "Premium Coffee Beans",
      sales: 38,
      revenue: "$1,747.62",
      stock: 67,
      image: "☕",
    },
    {
      name: "Organic Face Cream",
      sales: 31,
      revenue: "$4,029.69",
      stock: 12,
      image: "🧴",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-warning text-warning-foreground";
      case "Shipped":
        return "bg-primary text-primary-foreground";
      case "Delivered":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <VendorLayout>
      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <Button className="gradient-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className={cn("hover-lift", stat.gradient && "gradient-surface")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <span className={cn("text-sm font-medium", 
                        stat.trend === "up" ? "text-success" : "text-destructive"
                      )}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-lg", stat.gradient ? "bg-white/10" : "bg-primary/10")}>
                    <stat.icon className={cn("h-6 w-6", stat.gradient ? "text-white" : "text-primary")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders from your store</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{order.customer}</h4>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.amount}</p>
                    <p className="text-sm text-muted-foreground">{order.id}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Your best-selling items this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{product.image}</div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} sales • Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.revenue}</p>
                    </div>
                  </div>
                  <Progress value={(product.sales / 50) * 100} className="h-2" />
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View Product Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <ShoppingCart className="h-6 w-6" />
                <span>Process Orders</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Customer Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </VendorLayout>
  );
};

export default VendorDashboard;