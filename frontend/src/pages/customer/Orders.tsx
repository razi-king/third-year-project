import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import orderService from "@/services/orderService";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Loader2, Package } from "lucide-react";

const Orders = () => {
  const { data: ordersPage, isLoading, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderService.getMyOrders(),
  });

  const orders = ordersPage?.content || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-success text-success-foreground";
      case "processing":
      case "pending":
        return "bg-warning text-warning-foreground";
      case "shipped":
        return "bg-primary text-primary-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-1">Track and manage your recent purchases</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>A complete list of your past and active orders.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">
                <p>Failed to load orders. Please try again later.</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                  <ShoppingBag className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You haven't placed any orders yet. Start shopping to see your history here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-lg border hover:bg-accent/20 transition-colors">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id.split('-')[0]}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.items?.length || 0} item(s) purchased
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                      <div className="text-left md:text-right">
                        <p className="font-bold text-xl">${order.totalAmount?.toFixed(2)}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default Orders;
