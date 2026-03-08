import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  trend: "up" | "down";
  status: "active" | "inactive" | "pending";
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 299,
    stock: 45,
    sales: 126,
    trend: "up",
    status: "active",
  },
  {
    id: "2", 
    name: "Smart Fitness Watch",
    category: "Wearables",
    price: 199,
    stock: 23,
    sales: 89,
    trend: "up",
    status: "active",
  },
  {
    id: "3",
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 79,
    stock: 0,
    sales: 45,
    trend: "down",
    status: "inactive",
  },
  {
    id: "4",
    name: "Professional Camera Lens",
    category: "Photography",
    price: 599,
    stock: 12,
    sales: 34,
    trend: "up",
    status: "active",
  },
  {
    id: "5",
    name: "Gaming Mechanical Keyboard",
    category: "Gaming",
    price: 149,
    stock: 67,
    sales: 78,
    trend: "up",
    status: "pending",
  },
];

const StatusBadge = ({ status }: { status: Product["status"] }) => {
  const variants = {
    active: "bg-success-light text-success border-success/20",
    inactive: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-warning-light text-warning border-warning/20",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {status}
    </Badge>
  );
};

export const ProductTable = () => {
  return (
    <Card className="animate-fade-in shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Products</span>
          <Button variant="outline" size="sm">
            View All Products
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Product</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Stock</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Sales</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                  <td className="py-4 px-2">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-medium">${product.price}</td>
                  <td className="py-4 px-2">
                    <span className={`font-medium ${
                      product.stock === 0 ? "text-destructive" : 
                      product.stock < 20 ? "text-warning" : "text-foreground"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{product.sales}</span>
                      {product.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="py-4 px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};