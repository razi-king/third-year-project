import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import reviewService, { ReviewDto } from "@/services/reviewService";
import orderService from "@/services/orderService";
import { Loader2, Star, MessageSquare, Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Reviews = () => {
  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['myReviews'],
    queryFn: () => reviewService.getCustomerReviews(),
  });

  const { data: deliveredOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['deliveredOrders'],
    queryFn: () => orderService.getMyOrders({ status: 'delivered' }),
  });

  const reviewItems: ReviewDto[] = Array.isArray(reviews) ? reviews : reviews?.content || [];
  const reviewedProductIds = new Set(reviewItems.map(r => r.productId));

  const allDeliveredItems = deliveredOrders?.content?.flatMap(o => o.items) || [];
  
  // Get unique products that haven't been reviewed yet
  const reviewableProducts = Array.from(
    new Map(
      allDeliveredItems
        .filter(item => !reviewedProductIds.has(item.productId))
        .map(item => [item.productId, item])
    ).values()
  );

  const isLoading = reviewsLoading || ordersLoading;
  const error = reviewsError;

  return (
    <CustomerLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <p className="text-muted-foreground mt-1">Track and manage your product feedback</p>
        </div>
        
        {/* Ready to Review Section */}
        {reviewableProducts.length > 0 && (
          <Card className="border-primary/20 bg-primary/5 shadow-elegant overflow-hidden">
            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-primary">
                    <Star className="h-5 w-5 fill-primary" />
                    Ready to Review
                  </CardTitle>
                  <CardDescription>Share your thoughts on products you've recently received.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {reviewableProducts.length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviewableProducts.map((product) => (
                  <Card key={product.productId} className="bg-background/80 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0 group-hover:bg-primary/10 transition-colors">
                          📦
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{product.productName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Delivered to you</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-4 gradient-primary" asChild>
                        <Link to={`/customer/product/${product.productId}`}>
                          Write Review
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Product Reviews ({reviewItems.length})</CardTitle>
            <CardDescription>Your feedback helps other shoppers make better decisions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex flex-col justify-center items-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Loading your reviews...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">
                <p>Failed to load your reviews. Please try again later.</p>
              </div>
            ) : reviewItems.length === 0 ? (
              <div className="py-16 text-center">
                <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You haven't reviewed any products yet. After receiving an order, come back to share your thoughts.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewItems.map((review) => (
                  <Card key={review.id} className="hover:bg-accent/10 transition-colors border shadow-sm">
                    <CardContent className="p-5 flex flex-col h-full">
                       <div className="flex justify-between items-start mb-3">
                         <div>
                            <h3 className="font-semibold text-base">{review.productName || 'Verified Product'}</h3>
                            <div className="flex items-center gap-1 mt-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`} />
                              ))}
                              <span className="text-xs font-medium ml-2 text-muted-foreground">{review.rating}.0 / 5.0</span>
                            </div>
                         </div>
                         <Badge variant="outline" className="text-xs whitespace-nowrap bg-background">
                            {new Date(review.createdAt).toLocaleDateString()}
                         </Badge>
                       </div>
                       
                       <div className="mt-1 flex-1 bg-muted/30 p-4 rounded-lg border border-border/50">
                         <p className="text-sm italic text-foreground tracking-tight line-clamp-4">
                           "{review.comment}"
                         </p>
                       </div>
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

export default Reviews;
