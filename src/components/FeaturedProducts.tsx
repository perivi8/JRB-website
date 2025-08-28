import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AuthModal } from "./AuthModal";
import { useState } from "react";
import { getFeaturedProducts } from "@/data/products";
import { navigateToPage } from "@/utils/navigation";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { calculateDynamicPrice, calculateCompareAtPrice } from "@/utils/priceCalculator";

const FeaturedProducts = () => {
  const { addToCart, addToWishlist, isInCart, isInWishlist, removeFromWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { goldRates, silverRates, platinumRates } = useGoldPrice();

  const rawProducts = getFeaturedProducts(12);
  const products = rawProducts.map(product => ({
    ...product,
    price: calculateDynamicPrice(product, goldRates, silverRates, platinumRates),
    compareAtPrice: calculateCompareAtPrice(product, goldRates, silverRates, platinumRates)
  }));

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "sale":
        return "destructive";
      case "new":
        return "default";
      default:
        return "secondary";
    }
  };

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case "no-wastage":
        return "No Wastage";
      case "new":
        return "New";
      case "sale":
        return "Sale";
      case "certified":
        return "Certified";
      case "handcrafted":
        return "Handcrafted";
      case "premium":
        return "Premium";
      default:
        return badge;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (product: any) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleViewProduct = (productId: string) => {
    navigateToPage(`/product/${productId}`);
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-display font-playfair text-foreground mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium jewelry crafted with precision and care
          </p>
          <div className="divider-gold mt-6 max-w-24 mx-auto" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.slice(0, 8).map((product) => (
            <Card key={product.id} className="card-luxury group cursor-pointer h-full flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {product.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant={getBadgeVariant(badge)}
                          className="badge-premium text-xs"
                        >
                          {getBadgeText(badge)}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        isInWishlist(product.id) ? 'fill-current text-red-500' : ''
                      }`} 
                    />
                  </Button>

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProduct(product.id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="hero"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={isInCart(product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {isInCart(product.id) ? 'Added' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating.avg)
                                ? "text-gold fill-gold"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.rating.count})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.weight}g
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full mt-auto" 
                    variant="outline-gold"
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline-gold" onClick={() => navigateToPage('/shop')}>
            View All Products
          </Button>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </section>
  );
};

export default FeaturedProducts;