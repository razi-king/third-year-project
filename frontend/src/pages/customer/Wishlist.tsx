import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wishlistService, { WishlistItem } from "@/services/wishlistService";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading, error } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({ title: "Removed from wishlist", description: "The item has been successfully removed." });
    },
    onError: () => {
      toast({ title: "Failed to remove item", variant: "destructive" });
    }
  });

  const items: WishlistItem[] = Array.isArray(wishlist) ? wishlist : wishlist?.content || [];

  return (
    <CustomerLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">Manage all your saved items in one place.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Saved Items ({items.length})</CardTitle>
            <CardDescription>Items remain in your wishlist until you remove them or add them to your cart.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex flex-col justify-center items-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Loading your saved items...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">
                <p>Failed to load wishlist. Please try again later.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Looks like you haven't saved any items yet. Start exploring and save items for later!
                </p>
                <Button className="mt-6" variant="outline" asChild>
                  <Link to="/customer/browse">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover-lift shadow-elegant group">
                    <div className="aspect-square bg-muted relative">
                      {item.imageUrl ? (
                         <img src={item.imageUrl} alt={item.productName} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-accent text-muted-foreground">
                            <ShoppingCart className="h-8 w-8 mb-2 opacity-50" />
                            <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                         </div>
                      )}
                      
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                        onClick={() => removeMutation.mutate(item.productId)} 
                        disabled={removeMutation.isPending}
                      >
                        {removeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2 mt-1">
                        <h3 className="font-semibold text-sm line-clamp-2 leading-snug flex-1 mr-2" title={item.productName}>
                          {item.productName || 'Unknown Product'}
                        </h3>
                      </div>
                      <p className="font-bold text-lg text-primary">${item.price?.toFixed(2) || '0.00'}</p>
                      
                      <Button className="w-full mt-4 gradient-primary" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default Wishlist;
