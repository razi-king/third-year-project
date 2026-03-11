import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import productService from "@/services/productService";
import { Badge } from "@/components/ui/badge";
import { Loader2, PackageSearch, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsPage, isLoading, error } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => productService.getAll(),
  });

  const products = productsPage?.content || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-warning text-warning-foreground";
      case "out_of_stock":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredProducts = products.filter((p: any) => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Products</h1>
            <p className="text-muted-foreground mt-1">Manage and audit across the entire vendor catalog</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or category..."
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
            <CardTitle>Global Inventory Ledger</CardTitle>
            <CardDescription>A master list displaying all active and inactive stock across vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Aggregating platform catalog...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center text-destructive">
                  <p>Failed to load product data. Please check network connections.</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                    <PackageSearch className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No products located</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {searchQuery ? "No catalog matches your current search criteria." : "There are currently no products registered system-wide."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                      <tr>
                        <th className="px-4 py-3 font-medium">Product ID</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Stock</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product: any) => (
                        <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-4 font-medium max-w-[120px] truncate" title={product.id}>
                            #{product.id.substring(0,8)}
                          </td>
                          <td className="px-4 py-4 font-semibold max-w-[200px] truncate" title={product.name}>
                            {product.name}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{product.category}</td>
                          <td className="px-4 py-4 font-bold">${product.price.toFixed(2)}</td>
                          <td className="px-4 py-4">{product.stock}</td>
                          <td className="px-4 py-4">
                            <Badge className={getStatusColor(product.status)} variant="outline">
                              {product.status.replace('_', ' ')}
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

export default AdminProducts;
