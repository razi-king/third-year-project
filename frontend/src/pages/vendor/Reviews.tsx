import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import vendorService from "@/services/vendorService";
import { Loader2, Star, MessageSquareQuote } from "lucide-react";

const Reviews = () => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['vendorReviews'],
    queryFn: () => vendorService.getReviews()
  });

  const reviewsList = Array.isArray(reviews) ? reviews : [];

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Product Reviews</h1>
          <p className="text-muted-foreground mt-1">See what customers are saying about your items</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Reviews ({reviewsList.length})</CardTitle>
            <CardDescription>Monitor feedback spanning across your entire store inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">
                Failed to load reviews data.
              </div>
            ) : reviewsList.length === 0 ? (
              <div className="py-16 text-center">
                <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                  <MessageSquareQuote className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">Your product ratings and customer feedback will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsList.map((review: any) => (
                  <Card key={review.id} className="bg-accent/5">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{review.product?.name || "Unknown Product"}</h4>
                          <p className="text-sm text-muted-foreground">
                            By {review.customer?.name || "Customer"} on {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Reviews;
