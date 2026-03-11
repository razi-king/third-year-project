import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import vendorService from "@/services/vendorService";
import { Loader2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Customers = () => {
  const { data: ordersPage, isLoading, error } = useQuery({
    queryKey: ['vendorOrders'],
    // Utilizing the getOrders endpoint as requested to mine customers 
    queryFn: () => vendorService.getOrders(),
  });

  const orders = ordersPage?.content || [];
  
  // Extract unique customers from orders
  const uniqueCustomersMap = new Map();
  orders.forEach((order: any) => {
      if (order.customer && order.customer.id) {
          if (!uniqueCustomersMap.has(order.customer.id)) {
              uniqueCustomersMap.set(order.customer.id, {
                  ...order.customer,
                  orderCount: 1,
                  totalSpent: order.totalAmount || 0,
                  lastOrderDate: order.createdAt
              });
          } else {
              const customer = uniqueCustomersMap.get(order.customer.id);
              customer.orderCount += 1;
              customer.totalSpent += (order.totalAmount || 0);
              if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
                  customer.lastOrderDate = order.createdAt;
              }
          }
      }
  });

  const customersList = Array.from(uniqueCustomersMap.values());

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">My Customers</h1>
          <p className="text-muted-foreground mt-1">People who have purchased your products</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer List ({customersList.length})</CardTitle>
            <CardDescription>Overview of all buyers spanning your sales ledger.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">
                Failed to load customers data.
              </div>
            ) : customersList.length === 0 ? (
              <div className="py-16 text-center">
                <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No customers yet</h3>
                <p className="text-muted-foreground">Start selling products to see your customers here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customersList.map(customer => (
                   <Card key={customer.id} className="hover:bg-accent/5">
                      <CardContent className="p-5">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                               <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                               <h3 className="font-semibold truncate" title={customer.name}>{customer.name}</h3>
                               <p className="text-sm text-muted-foreground truncate" title={customer.email}>{customer.email}</p>
                            </div>
                         </div>
                         <div className="flex justify-between items-center mt-5 pt-4 border-t border-border">
                            <div>
                               <p className="text-xs text-muted-foreground">Total Spent</p>
                               <p className="font-medium text-primary">${customer.totalSpent.toFixed(2)}</p>
                            </div>
                            <Badge variant="outline">{customer.orderCount} Order(s)</Badge>
                         </div>
                      </CardContent>
                   </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Customers;
