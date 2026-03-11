import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import analyticsService from "@/services/analyticsService";
import { Progress } from "@/components/ui/progress";

const VendorAnalytics = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['vendorAnalyticsDashboardStats'],
    queryFn: () => analyticsService.getVendorStats(),
  });

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['vendorAnalyticsTopProducts'],
    queryFn: () => analyticsService.getTopProducts(5),
  });

  const isLoading = statsLoading || productsLoading;

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed metrics and performance of your store.</p>
        </div>

        {isLoading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats?.totalSales?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total sales revenue over all time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalOrders?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total lifetime orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalProducts?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active items in your store</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Your highest revenue generating items</CardDescription>
              </CardHeader>
              <CardContent>
                {(!topProducts || topProducts.length === 0) ? (
                  <p className="text-muted-foreground p-4 text-center">No top product data available.</p>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <h4 className="font-medium">{product.productName}</h4>
                          <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {product.totalSold} sold
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${product.revenue?.toLocaleString() || 0}</p>
                          <p className="text-xs text-muted-foreground">Total Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorAnalytics;
