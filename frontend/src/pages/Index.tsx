import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/navigation/Sidebar";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, TrendingUp, Package, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />
          
          {/* Dashboard Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Welcome Section */}
            <div className="gradient-hero rounded-2xl p-8 text-white animate-fade-in shadow-xl">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-white/80 mb-6 text-lg">
                  Here's what's happening with your store today. You have 12 new orders and 3 customer messages waiting.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    View Messages
                  </Button>
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Business Overview</h2>
              <MetricsCards />
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <SalesChart />
              </div>
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="shadow-elegant hover-lift animate-scale-in">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start gradient-primary" size="sm">
                      <Package className="mr-2 h-4 w-4" />
                      Manage Inventory
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Customer Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-elegant animate-slide-up">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Product updated</p>
                        <p className="text-xs text-muted-foreground">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low stock alert</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Product Table */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Product Performance</h2>
              <ProductTable />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
