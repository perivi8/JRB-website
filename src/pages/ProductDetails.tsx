import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Eye, Truck, Shield, RotateCcw, Award, ChevronLeft, ChevronRight, Plus, Minus, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthModal } from '@/components/AuthModal';
import { getProductById } from '@/data/products';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { calculateDynamicPrice, calculateCompareAtPrice } from '@/utils/priceCalculator';

const ProductDetails = () => {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInCart, isInWishlist, removeFromWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { goldRates, silverRates, platinumRates } = useGoldPrice();

  // Find the product by ID and apply dynamic pricing
  const rawProduct = getProductById(id || '');
  const product = rawProduct ? {
    ...rawProduct,
    price: calculateDynamicPrice(rawProduct, goldRates, silverRates, platinumRates),
    compareAtPrice: calculateCompareAtPrice(rawProduct, goldRates, silverRates, platinumRates)
  } : null;

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The product you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate('/shop')} className="bg-gradient-gold text-charcoal hover:bg-gold/90">
                Back to Shop
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    addToCart(product as any, quantity);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
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
      addToWishlist(product as any);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold font-playfair mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating.avg)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.avg} ({product.rating.count} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <p className="text-3xl font-bold text-gold">
                    ₹{product.price.toLocaleString()}
                  </p>
                  {product.compareAtPrice && (
                    <p className="text-lg text-muted-foreground line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                {(product.karat || product.silverPurity) && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.karat ? `${product.karat} Gold` : `${product.silverPurity === 'pure' ? 'Pure' : '925'} Silver`}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Live pricing based on current {product.karat ? 'gold' : 'silver'} rates
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div>
                <h3 className="font-semibold mb-2">Quantity</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Badge variant="secondary" className="px-4 py-2">
                    {quantity}
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-gold text-charcoal hover:bg-gold/90"
                  onClick={handleAddToCart}
                  disabled={isInCart(product.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart(product.id) ? 'Already in Cart' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleWishlistToggle}
                >
                  <Heart 
                    className={`h-4 w-4 mr-2 ${
                      isInWishlist(product.id) ? 'fill-current text-red-500' : ''
                    }`} 
                  />
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default ProductDetails;
