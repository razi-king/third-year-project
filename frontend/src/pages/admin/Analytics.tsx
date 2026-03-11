import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { Loader2, TrendingUp, DollarSign, Package, Users } from "lucide-react";

const Analytics = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: () => adminService.getDashboardStats()
  });

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">Holistic view of business volume and trends.</p>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <Card>
             <CardContent className="py-12 text-center text-destructive">
               Failed to ingest analytic node datasets. 
             </CardContent>
           </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
                <Users className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Global customer base</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Vendors</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats?.totalVendors || 0}</div>
                <p className="text-xs text-muted-foreground">Active storefront entities</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Circulated</CardTitle>
                <Package className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">Active in shared inventory</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <DollarSign className="h-4 w-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">Successfully orchestrated flow</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <Card>
             <CardHeader>
               <CardTitle>Orders Per Month</CardTitle>
               <CardDescription>Transactional velocity across trailing 6 months.</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="h-[250px] w-full flex items-center justify-center bg-accent/20 rounded-md border text-muted-foreground italic text-sm">
                  [Bar Chart Visualization Module - Integration Pending]
               </div>
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader>
               <CardTitle>Top Selling Products</CardTitle>
               <CardDescription>Items orchestrating the highest percentage of system revenues.</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                  {[1, 2, 3].map(id => (
                     <div key={id} className="flex justify-between items-center bg-accent/10 p-3 rounded-lg border">
                        <div className="flex gap-3 items-center">
                           <div className="font-semibold text-primary/60">#{id}</div>
                           <span className="text-sm">Premium Listing Data {id}</span>
                        </div>
                        <span className="font-bold text-sm text-green-600">High Volume</span>
                     </div>
                  ))}
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
