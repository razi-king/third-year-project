import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { Badge } from "@/components/ui/badge";
import { Loader2, Store, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['adminVendors'],
    queryFn: () => adminService.getAllVendors(),
  });

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-success text-success-foreground";
      case "PENDING":
        return "bg-warning text-warning-foreground";
      case "REJECTED":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredVendors = (vendors || []).filter((vendor: any) => 
    vendor.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    vendor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Vendors</h1>
            <p className="text-muted-foreground mt-1">Platform-wide vendor directory and approvals</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by store name or email..."
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
            <CardTitle>Vendor Directory</CardTitle>
            <CardDescription>A list of all registered vendor storefronts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Loading vendors...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center text-destructive">
                  <p>Failed to load vendors. Please try again later.</p>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                    <Store className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No vendors found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {searchQuery ? "No vendors matched your search criteria." : "No vendors exist on the platform."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                      <tr>
                        <th className="px-4 py-3 font-medium">Store Name</th>
                        <th className="px-4 py-3 font-medium">Contact Email</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendors.map((vendor: any) => (
                        <tr key={vendor.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-4 font-semibold max-w-[200px] truncate" title={vendor.storeName}>
                            {vendor.storeName}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{vendor.email || "N/A"}</td>
                          <td className="px-4 py-4 max-w-[200px] truncate cursor-help" title={vendor.storeDescription}>
                            {vendor.storeDescription || "No description provided"}
                          </td>
                          <td className="px-4 py-4 w-32">
                            <Badge className={getStatusColor(vendor.status)} variant="outline">
                              {vendor.status || "PENDING"}
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

export default Vendors;
