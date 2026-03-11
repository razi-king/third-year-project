import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import vendorService from "@/services/vendorService";
import { useAuth } from "@/context/AuthContext";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Loader2
} from "lucide-react";

const VendorProducts = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: productsPage, isLoading, error } = useQuery({
    queryKey: ['vendorProducts', user?.id, searchQuery],
    queryFn: () => vendorService.getProducts({ search: searchQuery }),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vendorService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
      toast({ title: "Product Deleted", description: "The product has been successfully removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
    }
  });

  const products = productsPage?.content || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "active":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDerivedStatus = (stock: number, status: string) => {
    if (status !== 'ACTIVE' && status !== 'active') return status;
    if (stock <= 0) return "Out of Stock";
    if (stock < 20) return "Low Stock";
    return "Active";
  };

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory and listings
            </p>
          </div>
          <Button className="gradient-primary flex items-center gap-2" asChild>
            <Link to="/vendor/add-product">
              <Plus className="h-4 w-4" />
              Add New Product
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>Manage and track your product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Loading your products...</p>
                </div>
              ) : error ? (
                <div className="py-8 text-center text-destructive">
                  Error loading products. Please try again.
                </div>
              ) : products.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  You haven't listed any products yet.
                </div>
              ) : (
                products.map((product: any) => {
                  const derivedStatus = getDerivedStatus(product.stock, product.status);
                  return (
                    <div key={product.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border hover:bg-accent/20 transition-colors">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="text-3xl">{product.imageUrl || "🛒"}</div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span className="text-xs">{4.5}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{product.stock > 0 ? "In Stock" : "Unavailable"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-left md:text-right">
                          <p className="font-semibold">${product.price?.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                        </div>
                        
                        <Badge className={getStatusColor(product.status)}>
                          {derivedStatus}
                        </Badge>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/vendor/edit-product/${product.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this product?")) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorProducts;
