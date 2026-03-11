import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Building2, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Package,
  Shield,
  Activity,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => adminService.getDashboardStats(),
  });

  const platformStats = [
    {
      title: "Total Users",
      value: isLoadingStats ? "..." : (dashboardStats?.totalUsers.toLocaleString() || "0"),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      gradient: true,
    },
    {
      title: "Active Vendors",
      value: isLoadingStats ? "..." : (dashboardStats?.totalVendors.toLocaleString() || "0"),
      change: "+8 this week",
      trend: "up",
      icon: Building2,
    },
    {
      title: "Total Products",
      value: isLoadingStats ? "..." : (dashboardStats?.totalProducts.toLocaleString() || "0"),
      change: "Items listed",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Total Orders",
      value: isLoadingStats ? "..." : (dashboardStats?.totalOrders.toLocaleString() || "0"),
      change: "Processed",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Pending Approvals",
      value: isLoadingStats ? "..." : (dashboardStats?.pendingApprovals.toString() || "0"),
      change: "Waitlist",
      trend: "warning",
      icon: UserCheck,
    },
    {
      title: "Active Disputes",
      value: "0",
      change: "Resolved",
      trend: "down",
      icon: AlertCircle,
    },
  ];

  const { data: usersList, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getAllUsers(), // Fetch recent users
  });

  const recentUsers = usersList?.slice(0, 5) || [];

  const recentOrders = [
    { 
      id: "#15847", 
      customer: "Alice Johnson", 
      vendor: "Tech Store Inc", 
      amount: "$299.99", 
      status: "Processing",
      date: "10 mins ago"
    },
    { 
      id: "#15846", 
      customer: "Bob Smith", 
      vendor: "Fashion Hub", 
      amount: "$149.50", 
      status: "Shipped",
      date: "25 mins ago"
    },
    { 
      id: "#15845", 
      customer: "Carol Davis", 
      vendor: "Electronics Pro", 
      amount: "$599.99", 
      status: "Delivered",
      date: "1 hour ago"
    },
    { 
      id: "#15844", 
      customer: "David Wilson", 
      vendor: "Home Essentials", 
      amount: "$89.99", 
      status: "Pending",
      date: "2 hours ago"
    },
  ];

  const systemHealth = [
    { metric: "Server Uptime", value: "99.9%", status: "excellent" },
    { metric: "Response Time", value: "127ms", status: "good" },
    { metric: "Error Rate", value: "0.01%", status: "excellent" },
    { metric: "Storage Usage", value: "67%", status: "warning" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "Processing":
        return "bg-warning text-warning-foreground";
      case "Shipped":
        return "bg-primary text-primary-foreground";
      case "Delivered":
        return "bg-success text-success-foreground";
      case "Pending":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-success";
      case "good":
        return "text-primary";
      case "warning":
        return "text-warning";
      case "critical":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Complete control over your platform.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link to="/admin/analytics">
                <Activity className="h-4 w-4" />
                System Health
              </Link>
            </Button>
            <Button className="gradient-primary flex items-center gap-2" asChild>
              <Link to="/admin/security">
                <Shield className="h-4 w-4" />
                Security Center
              </Link>
            </Button>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformStats.map((stat, index) => (
            <Card key={index} className={cn("hover-lift", stat.gradient && "gradient-surface")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <span className={cn("text-sm font-medium", 
                        stat.trend === "up" ? "text-success" : 
                        stat.trend === "warning" ? "text-warning" : "text-destructive"
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Users & Vendors */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>User & Vendor Management</CardTitle>
                <CardDescription>Recent registrations and account status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingUsers ? (
                  <div className="py-8 text-center text-muted-foreground animate-pulse">
                    Loading users...
                  </div>
                ) : recentUsers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No users found.
                  </div>
                ) : recentUsers.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {u.role === 'VENDOR' ? (
                          <Building2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Users className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{u.name}</h4>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={u.role === 'VENDOR' ? 'secondary' : 'outline'}>
                        {u.role}
                      </Badge>
                      <Badge className={getStatusColor('active')}>
                        Active
                      </Badge>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/admin/users">
                    View All Users & Vendors
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <span className={`text-sm font-bold ${getHealthColor(metric.status)}`}>
                      {metric.value}
                    </span>
                  </div>
                  <Progress 
                    value={
                      metric.metric === "Server Uptime" ? 99.9 :
                      metric.metric === "Storage Usage" ? 67 :
                      metric.status === "excellent" ? 95 : 80
                    } 
                    className="h-2" 
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/admin/analytics">
                  System Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Orders</CardTitle>
              <CardDescription>Latest transactions across all vendors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                  <div>
                    <h4 className="font-medium">{order.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} → {order.vendor}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.amount}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/orders">
                  View All Orders
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
              <CardDescription>Platform management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/admin/users">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">User Management</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/admin/vendors">
                    <Building2 className="h-6 w-6" />
                    <span className="text-sm">Vendor Approval</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/admin/products">
                    <Package className="h-6 w-6" />
                    <span className="text-sm">Product Review</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/admin/disputes">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm">Dispute Resolution</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/admin/security">
                    <Shield className="h-6 w-6" />
                    <span className="text-sm">Security Center</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link to="/admin/analytics">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Analytics</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
