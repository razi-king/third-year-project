import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import orderService from "@/services/orderService";
import { useAuth } from "@/context/AuthContext";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock
} from "lucide-react";

const Orders = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ordersPage, isLoading, error } = useQuery({
    queryKey: ['vendorOrders', user?.id, searchQuery],
    queryFn: () => orderService.getByVendor(user?.id || '', { /* add search if api supports it later */ }),
    enabled: !!user?.id,
  });

  const orders = ordersPage?.content || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
      case "pending":
        return "bg-muted text-muted-foreground";
      case "PROCESSING":
      case "processing":
        return "bg-warning text-warning-foreground";
      case "SHIPPED":
      case "shipped":
        return "bg-primary text-primary-foreground";
      case "DELIVERED":
      case "delivered":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
      case "pending":
        return Clock;
      case "PROCESSING":
      case "processing":
        return Package;
      case "SHIPPED":
      case "shipped":
        return Truck;
      case "DELIVERED":
      case "delivered":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const statusStats = [
    { status: "Pending", count: 8, color: "text-muted-foreground" },
    { status: "Processing", count: 12, color: "text-warning" },
    { status: "Shipped", count: 15, color: "text-primary" },
    { status: "Delivered", count: 34, color: "text-success" },
  ];

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage customer orders
            </p>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusStats.map((stat) => (
            <Card key={stat.status}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.status}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.count}</h3>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color} bg-current/10`}>
                    {React.createElement(getStatusIcon(stat.status), { 
                      className: `h-5 w-5 ${stat.color}` 
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID, customer, or product..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Process and track customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground animate-pulse">
                  Loading your orders...
                </div>
              ) : error ? (
                <div className="py-8 text-center text-destructive">
                  Error loading orders. Please try again.
                </div>
              ) : orders.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No orders found.
                </div>
              ) : (
                orders.map((order: any) => {
                  const StatusIcon = getStatusIcon(order.status);
                  // Quick mapping to support the existing UI layout since backend might return a List<OrderItem>
                  const primaryProduct = order.items && order.items.length > 0 ? order.items[0].productName : "Unknown Product";
                  const totalItems = order.items ? order.items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;

                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <StatusIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold cursor-pointer hover:underline" title={order.id}>#{order.id.split('-')[0]}</h3>
                          <p className="text-sm text-muted-foreground">{order.customerName || "Customer"}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 px-4">
                        <p className="font-medium">{primaryProduct}</p>
                        <p className="text-sm text-muted-foreground">Qty: {totalItems} {order.items?.length > 1 ? `(+${order.items.length - 1} other items)` : ""}</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-semibold">${order.totalAmount?.toFixed(2) || "0.00"}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Orders;