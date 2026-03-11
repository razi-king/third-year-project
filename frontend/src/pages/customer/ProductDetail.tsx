import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  User,
  MessageSquare,
  Loader2,
  Package,
} from "lucide-react";
import productService from "@/services/productService";
import cartService from "@/services/cartService";
import wishlistService from "@/services/wishlistService";
import reviewService, { ReviewDto } from "@/services/reviewService";
import { useToast } from "@/hooks/use-toast";

const StarSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none transition-transform hover:scale-110"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground font-medium">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
};

const ReviewCard = ({ review }: { review: ReviewDto }) => (
  <Card className="border shadow-sm hover:bg-accent/10 transition-colors">
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-2">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{review.customerName || "Anonymous"}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-background shrink-0">
          {new Date(review.createdAt).toLocaleDateString()}
        </Badge>
      </div>
      {review.comment && (
        <div className="bg-muted/30 border border-border/50 rounded-lg p-3 mt-2">
          <p className="text-sm italic text-foreground/80 leading-relaxed">
            "{review.comment}"
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id!),
    enabled: !!id,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["productReviews", id],
    queryFn: () => reviewService.getProductReviews(id!),
    enabled: !!id,
  });

  const reviewsList: ReviewDto[] = Array.isArray(reviews) ? reviews : [];

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addItem(id!, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to Cart", description: `${product?.name} added to your cart.` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add to cart.", variant: "destructive" });
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => {
      if (product?.isWishlisted) {
        return wishlistService.removeFromWishlist(id!);
      } else {
        return wishlistService.addToWishlist(id!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      const msg = product?.isWishlisted ? "Removed from wishlist" : "Added to wishlist";
      toast({ title: msg });
    },
    onError: (error: any) => {
      toast({
        title: "Wishlist error",
        description: error?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: () => reviewService.addReview(id!, { rating: reviewRating, comment: reviewComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews", id] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast({ title: "Review submitted!", description: "Thank you for your feedback." });
      setReviewRating(0);
      setReviewComment("");
    },
    onError: (error: any) => {
      toast({
        title: "Could not submit review",
        description: error?.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    submitReviewMutation.mutate();
  };

  if (productLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </CustomerLayout>
    );
  }

  if (!product) {
    return (
      <CustomerLayout>
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-40" />
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-6">This product may have been removed.</p>
          <Button asChild>
            <Link to="/customer/browse">Browse Products</Link>
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  const inStock = product.status === "ACTIVE" || product.stock > 0;

  return (
    <CustomerLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Back Nav */}
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/customer/browse">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>

        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <Card className="overflow-hidden shadow-elegant">
            <div className="aspect-square bg-muted flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <ShoppingCart className="h-20 w-20 opacity-20" />
                  <span className="text-sm font-medium uppercase tracking-wider opacity-50">
                    No Image
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Info */}
          <div className="space-y-5">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-3">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
              {product.vendorName && (
                <p className="text-muted-foreground mt-1">
                  by <span className="font-medium text-foreground">{product.vendorName}</span>
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{Number(product.rating ?? 0).toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews ?? 0} review{product.reviews !== 1 ? "s" : ""})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-primary">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>

            {/* Stock */}
            <Badge
              className={
                inStock
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }
            >
              {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
            </Badge>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1 gradient-primary"
                size="lg"
                disabled={!inStock || addToCartMutation.isPending}
                onClick={() => addToCartMutation.mutate()}
              >
                {addToCartMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-4 ${product.isWishlisted ? "text-red-500 border-red-200 bg-red-50 hover:bg-red-100" : ""}`}
                onClick={() => toggleWishlistMutation.mutate()}
                disabled={toggleWishlistMutation.isPending}
              >
                {toggleWishlistMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${product.isWishlisted ? "fill-current text-red-500" : ""}`}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Customer Reviews ({reviewsList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : reviewsList.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No reviews yet</p>
                    <p className="text-sm">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewsList.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit Review */}
          <div>
            <Card className="shadow-elegant sticky top-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  Write a Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Your Rating</p>
                  <StarSelector value={reviewRating} onChange={setReviewRating} />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Your Review</p>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="resize-none"
                  />
                </div>

                <Button
                  className="w-full gradient-primary"
                  onClick={handleSubmitReview}
                  disabled={submitReviewMutation.isPending || reviewRating === 0}
                >
                  {submitReviewMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Reviews are only accepted for products you have purchased.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProductDetail;
