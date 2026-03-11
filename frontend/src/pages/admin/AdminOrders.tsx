import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import orderService from "@/services/orderService";

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ordersPage, isLoading, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => orderService.getAll(),
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

  const filteredOrders = orders.filter((order: any) => 
    order.id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Orders</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage all system transactions</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID or Customer Name..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Orchestrated Orders</CardTitle>
            <CardDescription>A comprehensive ledger of every transaction handled over the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Loading global orders...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center text-destructive">
                  <p>Failed to load platform orders. Please try again later.</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                    <Package className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No orders recorded</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {searchQuery ? "No orders matched your search criteria." : "There are currently no transaction records."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                      <tr>
                        <th className="px-4 py-3 font-medium">Order ID</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium">Items</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order: any) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-4 font-medium max-w-[120px] truncate" title={order.id}>
                            #{order.id.split('-')[0]}
                          </td>
                          <td className="px-4 py-4">{order.customerName}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              {order.items?.map((item: any, idx: number) => (
                                <span key={idx} className="truncate max-w-[200px]" title={item.productName}>
                                  {item.quantity}x {item.productName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-4 font-bold">${order.totalAmount?.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <Badge className={getStatusColor(order.status)} variant="outline">
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
