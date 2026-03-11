import { useQuery } from "@tanstack/react-query";
import productService from "@/services/productService";
import { useAuth } from "@/context/AuthContext";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Calendar,
  Download
} from "lucide-react";
import { SalesChart } from "@/components/dashboard/SalesChart";

const Analytics = () => {
  const { user } = useAuth();

  const { data: productsPage, isLoading } = useQuery({
    queryKey: ['vendorAnalytics', user?.id],
    queryFn: () => productService.getByVendor(user?.id || '', { size: 100 }), // Fetch larger size for metrics
    enabled: !!user?.id,
  });

  const products = productsPage?.content || [];
  
  // Very basic derived metrics to show variation based on real products
  const totalStockStr = products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0).toString();
  const totalProductsStr = products.length.toString();
  
  const kpiData = [
    {
      title: "Revenue",
      value: "$0.00", // Would come from an actual analytics/sales endpoint
      change: "0% from last month",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: "0",
      change: "0% from last month",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Total Listings",
      value: totalProductsStr,
      change: "Listed products",
      trend: "up",
      icon: Package,
    },
    {
      title: "Total Stock Inventory",
      value: totalStockStr,
      change: "Items available",
      trend: "up",
      icon: Users,
    },
  ];

  const conversionMetrics = [
    {
      metric: "Conversion Rate",
      value: "3.2%",
      progress: 32,
      trend: "up",
      change: "+0.4%",
    },
    {
      metric: "Cart Abandonment",
      value: "68.5%",
      progress: 68.5,
      trend: "down",
      change: "-2.3%",
    },
    {
      metric: "Return Customer Rate",
      value: "24.8%",
      progress: 24.8,
      trend: "up",
      change: "+3.1%",
    },
    {
      metric: "Average Order Value",
      value: "$127.45",
      progress: 75,
      trend: "up",
      change: "+$12.30",
    },
  ];

  const topProducts = products.slice(0, 5).map((p: any) => ({
    name: p.name,
    sales: 0, // Mock for now
    revenue: "$0", // Mock for now
    growth: "0%"
  }));

  const customerSegments = [
    { segment: "New Customers", percentage: 35, count: 203 },
    { segment: "Returning Customers", percentage: 45, count: 258 },
    { segment: "VIP Customers", percentage: 20, count: 112 },
  ];

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into your store performance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold">{kpi.value}</h3>
                      <div className="flex items-center gap-1">
                        {kpi.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        )}
                        <span className={`text-xs font-medium ${
                          kpi.trend === "up" ? "text-success" : "text-destructive"
                        }`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <kpi.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <SalesChart />
          </div>

          {/* Conversion Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {conversionMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{metric.value}</span>
                      <span className={`text-xs ${
                        metric.trend === "up" ? "text-success" : "text-destructive"
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">No top products yet.</div>
                ) : (
                  topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{product.revenue}</p>
                        <p className="text-sm text-success">{product.growth}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Customer distribution analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {customerSegments.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{segment.segment}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold">{segment.percentage}%</span>
                      <p className="text-xs text-muted-foreground">{segment.count} customers</p>
                    </div>
                  </div>
                  <Progress value={segment.percentage} className="h-2" />
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">573</p>
                    <p className="text-xs text-muted-foreground">Total Customers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.2</p>
                    <p className="text-xs text-muted-foreground">Avg. Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$127</p>
                    <p className="text-xs text-muted-foreground">Avg. Order</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
};

export default Analytics;