import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { calculateTax, TaxBreakdown } from '../utils/taxCalculator';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  karat?: number;
  makingCharges?: number;
  weight?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  wishlistCount: number;
  taxBreakdown: TaxBreakdown;
  clearCart: () => void;
  clearWishlist: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Load cart and wishlist from localStorage when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCart = localStorage.getItem(`jrb_cart_${user.id}`);
      const savedWishlist = localStorage.getItem(`jrb_wishlist_${user.id}`);
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } else {
      // Clear cart and wishlist when user logs out
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`jrb_cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`jrb_wishlist_${user.id}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated, user]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => item.id === product.id);
      if (exists) return prevItems;
      
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Calculate total making charges for all items
  const totalMakingCharges = cartItems.reduce((total, item) => {
    const makingCharges = item.makingCharges || 0;
    return total + (makingCharges * item.quantity);
  }, 0);

  // Calculate tax breakdown using the proper tax calculator
  const taxBreakdown = calculateTax(cartTotal, totalMakingCharges);

  const clearCart = () => {
    setCartItems([]);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    isInCart,
    isInWishlist,
    cartTotal,
    cartCount,
    wishlistCount,
    taxBreakdown,
    clearCart,
    clearWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
