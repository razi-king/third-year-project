import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import analyticsService from "@/services/analyticsService";
import { Loader2, TrendingUp, DollarSign, Package, CreditCard } from "lucide-react";

const Reports = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['vendorAnalytics'],
    queryFn: () => analyticsService.getDashboardStats()
  });

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Review your store's performance metrics.</p>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <Card>
             <CardContent className="py-12 text-center text-destructive">
               Failed to load analytic metrics.
             </CardContent>
           </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.revenueChange || 0}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <CreditCard className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.ordersChange || 0}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
                <Package className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">Active in inventory</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Base</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats?.totalCustomers || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Graphical presentation not rendered in MVP version.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-center justify-center bg-accent/20 rounded-md border text-muted-foreground italic text-sm">
               [Interactive Chart Module - Implementation Pending]
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Reports;
