import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  Truck,
  Shield,
  ArrowLeft,
  Tag
} from "lucide-react";

const ShoppingCart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      vendor: "TechStore Pro",
      price: 299,
      originalPrice: 399,
      quantity: 1,
      image: "🎧",
      inStock: true,
      shipping: "Free shipping",
    },
    {
      id: 2,
      name: "Smart Fitness Watch", 
      vendor: "Health Tech",
      price: 199,
      originalPrice: 249,
      quantity: 2,
      image: "⌚",
      inStock: true,
      shipping: "Free shipping",
    },
    {
      id: 3,
      name: "Wireless Phone Charger",
      vendor: "PowerUp", 
      price: 39,
      originalPrice: 49,
      quantity: 1,
      image: "📱",
      inStock: false,
      shipping: "$5.99 shipping",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      const originalTotal = item.originalPrice * item.quantity;
      const currentTotal = item.price * item.quantity;
      return sum + (originalTotal - currentTotal);
    }
    return sum;
  }, 0);
  const shipping: number = 0; // Free shipping
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">Review your items and checkout</p>
          </div>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="animate-fade-in shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cart Items ({cartItems.length})</span>
                  <Badge variant="outline">
                    {cartItems.filter(item => item.inStock).length} in stock
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className={`flex items-center space-x-4 p-4 rounded-lg ${!item.inStock ? 'opacity-60 bg-muted/30' : 'hover:bg-accent/30'} transition-colors`}>
                      <div className="text-3xl">{item.image}</div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">by {item.vendor}</p>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                          {item.originalPrice && (
                            <Badge variant="outline" className="text-xs">
                              Save ${item.originalPrice - item.price}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={item.inStock ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {item.inStock ? item.shipping : "Out of Stock"}
                          </Badge>
                          {!item.inStock && (
                            <Badge variant="outline" className="text-xs">
                              Save for later
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        {item.inStock ? (
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input 
                              type="number" 
                              value={item.quantity} 
                              className="w-16 text-center h-8"
                              min="1"
                            />
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            Notify when available
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        {item.originalPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {index < cartItems.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card className="animate-slide-up shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input placeholder="Enter promo code" className="flex-1" />
                  <Button variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="animate-scale-in shadow-elegant sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>You're saving</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-success">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full gradient-primary" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                  
                  <div className="flex items-center justify-center text-xs text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Shield className="mr-1 h-3 w-3" />
                      Secure checkout
                    </div>
                    <div className="flex items-center">
                      <Truck className="mr-1 h-3 w-3" />
                      Free returns
                    </div>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-success-light rounded-lg p-3">
                    <div className="flex items-center text-success text-sm font-medium">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      You saved ${savings.toFixed(2)} on this order!
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recently Viewed */}
            <Card className="animate-fade-in shadow-elegant">
              <CardHeader>
                <CardTitle className="text-base">You might also like</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Bluetooth Mouse", price: "$29", image: "🖱️" },
                  { name: "USB-C Cable", price: "$15", image: "🔌" },
                  { name: "Phone Case", price: "$25", image: "📱" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/30 cursor-pointer transition-colors">
                    <span className="text-lg">{item.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ShoppingCart;