import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import vendorService from "@/services/vendorService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

// ─── Workflow definition ─────────────────────────────────────────────────────
// PENDING → CONFIRMED → SHIPPED → DELIVERED  (forward-only)
// PENDING or CONFIRMED → CANCELLED  (can abort early)
// DELIVERED and CANCELLED are terminal — no further transitions

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING:   ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED",   "CANCELLED"],
  SHIPPED:   ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING:   "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED:   "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED:   "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const VendorOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: ordersPage, isLoading, error } = useQuery({
    queryKey: ['vendorOrders'],
    queryFn: () => vendorService.getOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const response = await api.put(`/api/vendor/orders/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      toast({
        title: "Status Updated",
        description: `Order moved to ${STATUS_LABELS[variables.status]}.`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Cannot update status",
        description: err?.response?.data?.message || "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const orders = ordersPage?.content || [];

  const filteredOrders = orders.filter((order: any) =>
    order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatus = (order: any): OrderStatus =>
    (order.status?.toUpperCase() as OrderStatus) || "PENDING";

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage and track your customer orders</p>
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
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Orders advance through: <strong>Pending → Confirmed → Shipped → Delivered</strong>.
              Only the next valid step is shown per order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Loading your orders...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center text-destructive">
                  <p>Failed to load orders. Please try again later.</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                    <Package className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                      ? "No orders matched your search criteria."
                      : "You haven't received any orders yet."}
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
                        <th className="px-4 py-3 font-medium">Next Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order: any) => {
                        const currentStatus = getStatus(order);
                        const nextStatuses = NEXT_STATUSES[currentStatus] ?? [];
                        const isTerminal = nextStatuses.length === 0;
                        const isPending =
                          updateStatusMutation.isPending &&
                          (updateStatusMutation.variables as any)?.id === order.id;

                        return (
                          <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-4 font-medium max-w-[120px] truncate" title={order.id}>
                              #{order.id.split('-')[0]}
                            </td>
                            <td className="px-4 py-4">{order.customerName}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                {order.items?.map((item: any, idx: number) => (
                                  <span key={idx} className="truncate max-w-[200px]" title={item.productName}>
                                    {item.quantity}× {item.productName}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-4 font-bold">${order.totalAmount?.toFixed(2)}</td>

                            {/* Current status badge */}
                            <td className="px-4 py-4">
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${STATUS_COLORS[currentStatus] ?? ""}`}
                              >
                                {STATUS_LABELS[currentStatus] ?? currentStatus}
                              </Badge>
                            </td>

                            {/* Next-step action buttons — only valid transitions */}
                            <td className="px-4 py-4">
                              {isTerminal ? (
                                <span className="text-xs text-muted-foreground italic">—</span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {nextStatuses.map((next) => (
                                    <Button
                                      key={next}
                                      size="sm"
                                      variant={next === "CANCELLED" ? "destructive" : "outline"}
                                      className="h-7 text-xs px-2"
                                      disabled={isPending}
                                      onClick={() =>
                                        updateStatusMutation.mutate({ id: order.id, status: next })
                                      }
                                    >
                                      {isPending ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <>
                                          <ChevronRight className="h-3 w-3 mr-1" />
                                          {STATUS_LABELS[next]}
                                        </>
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorOrders;
