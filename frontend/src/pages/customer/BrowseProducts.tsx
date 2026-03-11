import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import productService from "@/services/productService";
import cartService from "@/services/cartService";
import wishlistService from "@/services/wishlistService";
import { useToast } from "@/hooks/use-toast";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BrowseProducts = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const categories = [
    "All Categories",
    "Electronics", 
    "Fashion",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Beauty",
    "Automotive"
  ];

  const { data: productsPage, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, viewMode], // simple dependency key
    queryFn: () => productService.getAll({ search: searchQuery }),
  });

  const { data: wishlistItems } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
  });

  const wishlistIds = new Set(wishlistItems?.map((item: any) => item.productId) || []);

  const products = productsPage?.content?.map((p: any) => ({
    ...p,
    isWishlisted: p.isWishlisted !== undefined ? p.isWishlisted : wishlistIds.has(p.id)
  })) || [];

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cartService.addItem(productId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: "Success", description: "Product added to cart" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add product to cart", variant: "destructive" });
    }
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: (product: any) => {
      if (product.isWishlisted) {
        return wishlistService.removeFromWishlist(product.id);
      } else {
        return wishlistService.addToWishlist(product.id);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ 
        title: variables.isWishlisted ? "Removed" : "Wishlisted", 
        description: variables.isWishlisted ? "Product removed from wishlist" : "Product added to your wishlist" 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Could not update wishlist", 
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive"
      });
    }
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Best Seller": return "bg-success-light text-success";
      case "Sale": return "bg-destructive/10 text-destructive";
      case "New": return "bg-primary/10 text-primary";
      case "Limited": return "bg-warning-light text-warning";
      case "Popular": return "bg-purple-100 text-purple-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const ProductCard = ({ product }: { product: any }) => {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
      <Card className={`group hover-lift animate-scale-in shadow-elegant transition-all duration-300 ${!product.inStock ? 'opacity-60' : ''}`}>
        <CardHeader className="p-0 relative">
          <div className="relative p-6 pb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">{product.image}</div>
              <Button 
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 ${product.isWishlisted ? 'text-destructive' : 'text-muted-foreground'}`}
                onClick={() => toggleWishlistMutation.mutate(product)}
                disabled={toggleWishlistMutation.isPending && toggleWishlistMutation.variables?.id === product.id}
              >
                <Heart className={`h-4 w-4 ${product.isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            {product.badge && (
              <Badge className={`absolute top-4 left-4 ${getBadgeColor(product.badge)}`}>
                {product.badge}
              </Badge>
            )}
            
            {discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                -{discount}%
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <div className="space-y-3">
            <div>
              <Link
                to={`/customer/product/${product.id}`}
                className="font-semibold text-sm line-clamp-2 mb-1 hover:text-primary transition-colors"
              >
                {product.name}
              </Link>
              <p className="text-xs text-muted-foreground">by {product.vendor}</p>
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1" 
                size="sm"
                disabled={!product.inStock || addToCartMutation.isPending}
                onClick={() => addToCartMutation.mutate(product.id)}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.status === 'ACTIVE' || product.status === 'active' || product.stock > 0 || product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to={`/customer/product/${product.id}`}>Details</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Browse Products</h1>
              <p className="text-muted-foreground">Discover amazing products from top vendors</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Rating: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Best Sellers</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} products
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-muted-foreground animate-pulse">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="p-4 bg-destructive/10 text-destructive rounded-full">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Error Loading Products</h3>
              <p className="text-muted-foreground max-w-sm">
                There was a problem fetching the products. Please try again later.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground max-w-sm">
                We couldn't find any products matching your current filters. Try adjusting your search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product: any) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  inStock: product.status === 'ACTIVE' || product.status === 'active' || product.stock > 0,
                  vendor: product.vendorName || "Unknown Vendor",
                  image: product.imageUrl || "🛒",
                  rating: product.rating != null ? product.rating : 0.0,
                  reviews: product.reviews != null ? product.reviews : 0
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {!isLoading && products.length > 0 && (
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default BrowseProducts;