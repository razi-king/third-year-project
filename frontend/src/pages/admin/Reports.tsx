import { useState } from "react";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, Database, Activity, Loader2, Users, Building2, ShoppingCart, Package, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import orderService from "@/services/orderService";
import productService from "@/services/productService";
import api from "@/services/api";

const Reports = () => {
  const { toast } = useToast();

  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleExport = async (reportType: string) => {
    try {
      setIsDownloading(reportType);
      const response = await api.get('/api/admin/reports/export', {
        params: { type: reportType },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType.replace(/\\s+/g, '_').toLowerCase()}_report.csv`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `${reportType} report has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while attempting to download the report.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const { data: ordersPage, isLoading: ordersLoading } = useQuery({
    queryKey: ['adminOrdersReport'],
    queryFn: () => orderService.getAll({ size: 10000 })
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsersReport'],
    queryFn: () => adminService.getAllUsers()
  });

  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ['adminVendorsReport'],
    queryFn: () => adminService.getAllVendors()
  });

  const { data: productsPage, isLoading: productsLoading } = useQuery({
    queryKey: ['adminProductsReport'],
    queryFn: () => productService.getAll({ size: 1 })
  });

  const isLoading = ordersLoading || usersLoading || vendorsLoading || productsLoading;

  const totalRevenue = ordersPage?.content.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
  const totalOrders = ordersPage?.totalElements || 0;
  const totalUsers = users?.length || 0;
  const totalVendors = vendors?.length || 0;
  const totalProducts = productsPage?.totalElements || 0;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">System Reports</h1>
          <p className="text-muted-foreground mt-1">Generate exportable data snapshots for auditing and analysis</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Building2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVendors.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Financial Audits
              </CardTitle>
              <CardDescription>Export transaction histories and payout logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed ledger of all settled and pending transactions for tax and accounting purposes.
              </p>
              <Button onClick={() => handleExport('Financial Audit')} className="w-full gap-2" disabled={isDownloading === 'Financial Audit'}>
                {isDownloading === 'Financial Audit' ? <Loader2 className="h-4 w-4 animate-spin" /> : <DownloadCloud className="h-4 w-4" />} Export CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" /> Vendor Directory
              </CardTitle>
              <CardDescription>Consolidated registered vendor contact points</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Full list of active vendors, their store profile metadata, and corresponding contact info.
              </p>
              <Button onClick={() => handleExport('Vendor Directory')} className="w-full gap-2" variant="outline" disabled={isDownloading === 'Vendor Directory'}>
                {isDownloading === 'Vendor Directory' ? <Loader2 className="h-4 w-4 animate-spin" /> : <DownloadCloud className="h-4 w-4" />} Export CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> System Metrics
              </CardTitle>
              <CardDescription>Platform usage and bandwidth analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Technical diagnostic reports detailing uptime, API hit rates, and error frequencies.
              </p>
              <Button onClick={() => handleExport('System Logs')} className="w-full gap-2" variant="secondary" disabled={isDownloading === 'System Logs'}>
                {isDownloading === 'System Logs' ? <Loader2 className="h-4 w-4 animate-spin" /> : <DownloadCloud className="h-4 w-4" />} Export CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
