import React from "react";
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
  const orders = [
    {
      id: "#12543",
      customer: "Sarah Johnson",
      email: "sarah.j@email.com",
      product: "Wireless Bluetooth Headphones",
      quantity: 2,
      amount: "$179.98",
      status: "Processing",
      date: "Dec 15, 2024",
      time: "2:30 PM",
    },
    {
      id: "#12542",
      customer: "Mike Chen",
      email: "mike.chen@email.com",
      product: "Premium Coffee Beans (2kg)",
      quantity: 1,
      amount: "$45.99",
      status: "Shipped",
      date: "Dec 15, 2024",
      time: "1:15 PM",
    },
    {
      id: "#12541",
      customer: "Emily Davis",
      email: "emily.davis@email.com",
      product: "Organic Face Cream Set",
      quantity: 1,
      amount: "$129.99",
      status: "Delivered",
      date: "Dec 14, 2024",
      time: "4:45 PM",
    },
    {
      id: "#12540",
      customer: "David Wilson",
      email: "david.w@email.com",
      product: "Fitness Tracker Pro",
      quantity: 1,
      amount: "$199.99",
      status: "Pending",
      date: "Dec 14, 2024",
      time: "11:20 AM",
    },
    {
      id: "#12539",
      customer: "Lisa Martinez",
      email: "lisa.m@email.com",
      product: "Smart Home Speaker",
      quantity: 3,
      amount: "$447.00",
      status: "Processing",
      date: "Dec 13, 2024",
      time: "9:10 AM",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-muted text-muted-foreground";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return Clock;
      case "Processing":
        return Package;
      case "Shipped":
        return Truck;
      case "Delivered":
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
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <StatusIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 px-4">
                      <p className="font-medium">{order.product}</p>
                      <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                        <p className="text-xs text-muted-foreground">{order.time}</p>
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
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Orders;