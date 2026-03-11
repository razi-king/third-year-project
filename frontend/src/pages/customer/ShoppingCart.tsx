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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import cartService from "@/services/cartService";
import orderService from "@/services/orderService";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const ShoppingCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [shippingAddress, setShippingAddress] = useState("");

  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => 
      cartService.updateQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update quantity", variant: "destructive" });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: "Success", description: "Item removed from cart" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove item", variant: "destructive" });
    }
  });

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate(productId);
  };

  const navigate = useNavigate();

  const createOrderMutation = useMutation({
    mutationFn: (orderData: { items: any[]; shippingAddress: string }) => 
      orderService.create(orderData),
    onSuccess: async () => {
      await cartService.clearCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: "Order Placed", description: "Your order has been successfully placed!" });
      navigate("/customer/orders");
    },
    onError: (err: any) => {
      toast({ 
        title: "Checkout Error", 
        description: err?.response?.data?.message || "Failed to create order", 
        variant: "destructive" 
      });
    }
  });

  const handleCheckout = () => {
    if (!cartItems.length) return;
    if (!shippingAddress.trim()) {
      toast({ title: "Validation Error", description: "Please enter a shipping address", variant: "destructive" });
      return;
    }
    
    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      productName: item.productName
    }));

    createOrderMutation.mutate({
      items,
      shippingAddress,
    });
  };

  const cartItems = cart?.items || [];
  const subtotal = cart?.totalAmount || 0;
  const savings = 0;
  const shipping: number = 0; // Free shipping
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="text-center py-10">
          <p className="text-destructive mb-4">Error loading cart. Please try again.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['cart'] })}>Retry</Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">Review your items and checkout</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/customer/browse">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="animate-fade-in shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cart Items ({cartItems.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.productId || index}>
                    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-accent/30 transition-colors">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="h-16 w-16 object-cover rounded" />
                      ) : (
                        <div className="h-16 w-16 bg-muted flex items-center justify-center rounded text-2xl">🛍️</div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{item.productName}</h3>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" size="icon" className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input 
                            type="number" 
                            value={item.quantity} 
                            className="w-16 text-center h-8"
                            readOnly
                          />
                          <Button 
                            variant="outline" size="icon" className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={removeItemMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {index < cartItems.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/customer/browse">Start Shopping</Link>
                    </Button>
                  </div>
                )}
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

                <div className="space-y-2 py-2">
                  <label className="text-sm font-medium">Shipping Address</label>
                  <Input 
                    placeholder="Enter full shipping address" 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full gradient-primary" 
                    size="lg" 
                    onClick={handleCheckout}
                    disabled={createOrderMutation.isPending || cartItems.length === 0}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {createOrderMutation.isPending ? "Processing..." : "Proceed to Checkout"}
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