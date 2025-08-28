import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthModal } from '@/components/AuthModal';

const Wishlist = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = (item: any) => {
    removeFromWishlist(item.id);
    toast({
      title: "Removed from Wishlist",
      description: `${item.name} has been removed from your wishlist.`,
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Please Sign In</h1>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to view your wishlist.
              </p>
              <Button onClick={() => setIsAuthModalOpen(true)} className="bg-gradient-gold text-charcoal hover:bg-gold/90">
                Sign In
              </Button>
            </div>
          </div>
        </div>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist and shop them later.
              </p>
              <Button onClick={() => navigate('/shop')} className="bg-gradient-gold text-charcoal hover:bg-gold/90">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-playfair mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={() => handleRemoveFromWishlist(item)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.category}</p>
                    <p className="font-bold text-gold text-xl mb-4">₹{item.price.toLocaleString()}</p>
                    
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-gradient-gold text-charcoal hover:bg-gold/90"
                        onClick={() => handleAddToCart(item)}
                        disabled={isInCart(item.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
