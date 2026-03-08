import { useState } from "react";
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

  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      vendor: "TechStore Pro",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 124,
      image: "🎧",
      category: "Electronics",
      inStock: true,
      isWishlisted: false,
      badge: "Best Seller",
      description: "High-quality wireless headphones with noise cancellation and premium sound quality."
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      vendor: "Health Tech",
      price: 199,
      originalPrice: 249,
      rating: 4.6,
      reviews: 89,
      image: "⌚",
      category: "Electronics",
      inStock: true,
      isWishlisted: true,
      badge: "Sale",
      description: "Advanced fitness tracking with heart rate monitoring and GPS features."
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      vendor: "AudioTech",
      price: 79,
      originalPrice: 99,
      rating: 4.4,
      reviews: 156,
      image: "🔊",
      category: "Electronics", 
      inStock: false,
      isWishlisted: false,
      badge: "Limited",
      description: "Compact speaker with powerful sound and long battery life."
    },
    {
      id: 4,
      name: "Professional Camera Lens",
      vendor: "Photo Pro",
      price: 599,
      originalPrice: 699,
      rating: 4.9,
      reviews: 45,
      image: "📷",
      category: "Electronics",
      inStock: true,
      isWishlisted: false,
      badge: "New",
      description: "Professional grade lens for DSLR cameras with exceptional clarity."
    },
    {
      id: 5,
      name: "Gaming Mechanical Keyboard",
      vendor: "Game Master",
      price: 149,
      originalPrice: null,
      rating: 4.7,
      reviews: 203,
      image: "⌨️",
      category: "Electronics",
      inStock: true,
      isWishlisted: true,
      badge: "Popular",
      description: "RGB mechanical keyboard with customizable switches and lighting."
    },
    {
      id: 6,
      name: "Wireless Phone Charger",
      vendor: "PowerUp",
      price: 39,
      originalPrice: 49,
      rating: 4.2,
      reviews: 78,
      image: "📱",
      category: "Electronics",
      inStock: true,
      isWishlisted: false,
      badge: null,
      description: "Fast wireless charging pad compatible with all Qi-enabled devices."
    },
  ];

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

  const ProductCard = ({ product }: { product: typeof products[0] }) => {
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
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
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
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
          
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default BrowseProducts;