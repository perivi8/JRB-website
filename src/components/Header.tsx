import { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Search, Menu, User, Heart, ShoppingCart, Clock, Eye, Package, LogOut, Sparkles, TrendingUp, Tag, Star } from "lucide-react";
import { scrollToTop } from "@/utils/scrollToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { AuthModal } from "./AuthModal";
import { useToast } from "@/hooks/use-toast";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { PRODUCTS } from "@/data/products";
// import "@/utils/testLivePrices"; // Disabled to reduce API calls

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<'gold-24k' | 'gold-22k' | 'gold-18k' | 'silver-pure' | 'silver-925'>('gold-24k');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Define types for search suggestions
  interface SearchSuggestion {
    type: 'history' | 'product' | 'category';
    term: string;
    icon?: React.ComponentType<any>;
    product?: {
      id: string;
      name: string;
      image: string;
      basePrice: number;
      category: string;
    };
  }
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const { goldRates, silverRates, platinumRates, loading, error, updateCount } = useGoldPrice();
  const { toast } = useToast();

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = (history: string[]) => {
    localStorage.setItem('searchHistory', JSON.stringify(history));
    setSearchHistory(history);
  };

  // Handle search functionality
  const handleSearch = (query: string, productId?: string, suggestionType?: string) => {
    if (query.trim() && !searchHistory.includes(query.trim()) && suggestionType !== 'category') {
      const newHistory = [query.trim(), ...searchHistory.slice(0, 9)]; // Keep last 10 searches
      saveSearchHistory(newHistory);
    }
    
    if (productId) {
      // Navigate to specific product page
      navigate(`/product/${productId}`);
    } else if (query.trim()) {
      // Handle category suggestions with specific filters
      let searchUrl = '/shop';
      if (suggestionType === 'category') {
        switch (query) {
          case 'New Products':
            searchUrl = '/shop?filter=new';
            break;
          case 'Trending Products':
            searchUrl = '/shop?filter=trending';
            break;
          case 'Discount Products':
            searchUrl = '/shop?filter=discount';
            break;
          case 'Featured Products':
            searchUrl = '/shop?filter=featured';
            break;
          default:
            searchUrl = `/shop?search=${encodeURIComponent(query.trim())}`;
        }
      } else {
        searchUrl = `/shop?search=${encodeURIComponent(query.trim())}`;
      }
      navigate(searchUrl);
    }
    
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    try {
      setSearchQuery(value);
      setShowSearchResults(true); // Always show suggestions when focused
    } catch (error) {
      console.error('Error in handleSearchChange:', error);
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  // Get default category suggestions
  const getDefaultSuggestions = (): SearchSuggestion[] => {
    return [
      {
        type: 'category' as const,
        term: 'New Products',
        icon: Sparkles
      },
      {
        type: 'category' as const,
        term: 'Trending Products',
        icon: TrendingUp
      },
      {
        type: 'category' as const,
        term: 'Discount Products',
        icon: Tag
      },
      {
        type: 'category' as const,
        term: 'Featured Products',
        icon: Star
      }
    ];
  };

  // Get filtered products for search suggestions (same logic as Shop page)
  const getSearchSuggestions = (): SearchSuggestion[] => {
    if (!searchQuery.trim()) {
      const defaultSuggestions = getDefaultSuggestions();
      const historySuggestions = searchHistory.slice(0, 3).map(term => ({ type: 'history' as const, term, icon: Clock }));
      return [...defaultSuggestions, ...historySuggestions];
    }
    
    try {
      const query = searchQuery.toLowerCase();
      
      // Use same comprehensive search logic as Shop page
      const filtered = PRODUCTS.filter(product => {
        const searchableText = [
          product.name,
          product.description,
          product.category,
          ...(product.badges || []),
          ...(product.features || []),
          // Add karat/purity info
          product.karat || '',
          product.silverPurity || '',
          // Add specifications
          ...Object.values(product.specifications || {}),
          // Add weight info
          `${product.weight}g`,
          `${product.weight} gram`,
          `${product.weight} grams`
        ].join(' ').toLowerCase();
        
        return searchableText.includes(query);
      }).slice(0, 8); // Show more suggestions like shop page
      
      return filtered.map(product => ({ 
        type: 'product' as const, 
        term: product.name,
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          basePrice: product.basePrice,
          category: product.category
        }
      }));
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  };

  const navigationLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Schemes", href: "/schemes" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];


  const getCurrentRate = () => {
    if (loading) return 'Loading rates...';
    
    const cycleInfo = updateCount > 0 ? ` (Cycle #${updateCount})` : '';
    
    if (currentDisplay.startsWith('gold')) {
      if (!goldRates) {
        // Use fallback rates if API fails - Updated to current market rates
        const fallbackRates = { '24k': 10260, '22k': 9398, '18k': 7695 };
        const karat = currentDisplay.split('-')[1] as '24k' | '22k' | '18k';
        const rate = fallbackRates[karat];
        return `${karat} Gold: ₹${rate}/g* (Fallback)`;
      }
      const karat = currentDisplay.split('-')[1] as '24k' | '22k' | '18k';
      const rate = goldRates[karat];
      return `${karat} Gold: ₹${rate}/g${cycleInfo}`;
    } else {
      if (!silverRates) {
        // Use fallback rates if API fails - Updated to current market rates
        const fallbackRates = { pure: 135, '925': 125 };
        const purity = currentDisplay.split('-')[1] as 'pure' | '925';
        const rate = fallbackRates[purity];
        const displayName = purity === 'pure' ? 'Pure Silver' : '925 Silver';
        return `${displayName}: ₹${rate}/g* (Fallback)`;
      }
      const purity = currentDisplay.split('-')[1] as 'pure' | '925';
      const rate = silverRates[purity];
      const displayName = purity === 'pure' ? 'Pure Silver' : '925 Silver';
      return `${displayName}: ₹${rate}/g${cycleInfo}`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDisplay(prev => {
        switch (prev) {
          case 'gold-24k': return 'gold-22k';
          case 'gold-22k': return 'gold-18k';
          case 'gold-18k': return 'silver-pure';
          case 'silver-pure': return 'silver-925';
          case 'silver-925': return 'gold-24k';
          default: return 'gold-24k';
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top Bar - Gold Rate Ticker */}
      <div className="bg-gradient-gold text-charcoal py-2 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 text-sm font-medium flex-wrap">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-xs">LIVE</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Gold 24k: ₹{goldRates?.['24k']?.toLocaleString() || '10,260'}/g</span>
              <span>22k: ₹{goldRates?.['22k']?.toLocaleString() || '9,405'}/g</span>
              <span>18k: ₹{goldRates?.['18k']?.toLocaleString() || '7,775'}/g</span>
            </div>
            <span>|</span>
            <span>Silver: ₹{silverRates?.pure?.toLocaleString() || '130'}/g</span>
            <span>|</span>
            <span>Platinum: ₹{platinumRates?.pure?.toLocaleString() || '3,200'}/g</span>
            {updateCount > 0 && (
              <span className="text-green-600 text-xs animate-pulse">●</span>
            )}
            <span className="text-xs opacity-75">*Live rates—visit store for exact pricing</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink 
              to="/" 
              onClick={() => scrollToTop()}
            >
              <img 
                src="/jrb-logo.svg" 
                alt="JRB Logo" 
                className="h-16 w-auto object-contain"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => scrollToTop()}
                className={({ isActive }) =>
                  `text-foreground hover:text-gold transition-colors duration-200 font-medium ${
                    isActive ? 'text-gold border-b-2 border-gold pb-1' : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden sm:block relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jewelry..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                onFocus={handleSearchFocus}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 300)}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {(() => {
                  try {
                    const suggestions = getSearchSuggestions();
                    return suggestions.length > 0 ? (
                      <>
                        {searchQuery.trim() && (
                          <div className="px-3 py-2 text-sm text-gray-500 border-b">
                            Products ({suggestions.filter(s => s.type === 'product').length} found)
                          </div>
                        )}
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={`suggestion-${index}`}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {suggestion.type === 'history' ? (
                              <div 
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => handleSearch(suggestion.term)}
                              >
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{suggestion.term}</span>
                              </div>
                            ) : suggestion.type === 'category' ? (
                              <div 
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => handleSearch(suggestion.term, undefined, 'category')}
                              >
                                {suggestion.icon && <suggestion.icon className="h-4 w-4 text-gold" />}
                                <span className="text-sm font-medium">{suggestion.term}</span>
                              </div>
                            ) : (
                              <div 
                                className="flex items-center space-x-3 w-full cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('Product clicked, navigating to:', `/product/${suggestion.product?.id}`);
                                  navigate(`/product/${suggestion.product?.id}`);
                                  setSearchQuery('');
                                  setShowSearchResults(false);
                                }}
                              >
                                <img 
                                  src={suggestion.product?.image} 
                                  alt={suggestion.product?.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-left">{suggestion.product?.name}</div>
                                  <div className="text-xs text-gray-500 text-left">{suggestion.product?.category}</div>
                                  <div className="text-xs text-gold font-semibold text-left">₹{suggestion.product?.basePrice?.toLocaleString()}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No suggestions found
                      </div>
                    );
                  } catch (error) {
                    console.error('Error rendering suggestions:', error);
                    return (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Search suggestions unavailable
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gold/10 hover:text-gold transition-colors"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/wishlist');
                  scrollToTop();
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gold text-charcoal text-xs font-semibold">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gold/10 hover:text-gold transition-colors"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/cart');
                  scrollToTop();
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gold text-charcoal text-xs font-semibold">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline text-sm font-medium max-w-24 truncate">
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { navigate('/cart'); scrollToTop(); }}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Cart ({cartCount})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { navigate('/wishlist'); scrollToTop(); }}>
                    <Heart className="mr-2 h-4 w-4" />
                    My Wishlist ({wishlistCount})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { navigate('/orders'); scrollToTop(); }}>
                    <Package className="mr-2 h-4 w-4" />
                    View All Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gold/10 hover:text-gold transition-colors"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search jewelry..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                        onFocus={handleSearchFocus}
                        onBlur={() => setTimeout(() => setShowSearchResults(false), 300)}
                      />
                    </div>
                    
                    {/* Mobile Search Results */}
                    {showSearchResults && (
                      <div className="mt-2 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {(() => {
                          try {
                            const suggestions = getSearchSuggestions();
                            return suggestions.length > 0 ? (
                              <>
                                {!searchQuery.trim() && searchHistory.length > 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500 border-b">
                                    Recent Searches
                                  </div>
                                )}
                                {suggestions.map((suggestion, index) => (
                                  <div
                                    key={`mobile-suggestion-${index}`}
                                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    {suggestion.type === 'history' ? (
                                      <div 
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => {
                                          handleSearch(suggestion.term);
                                          setIsSearchOpen(false);
                                        }}
                                      >
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{suggestion.term}</span>
                                      </div>
                                    ) : suggestion.type === 'category' ? (
                                      <div 
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => {
                                          handleSearch(suggestion.term, undefined, 'category');
                                          setIsSearchOpen(false);
                                        }}
                                      >
                                        {suggestion.icon && <suggestion.icon className="h-4 w-4 text-gold" />}
                                        <span className="text-sm font-medium">{suggestion.term}</span>
                                      </div>
                                    ) : (
                                      <div 
                                        className="flex items-center space-x-3 w-full cursor-pointer"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          console.log('Mobile Product clicked, navigating to:', `/product/${suggestion.product?.id}`);
                                          navigate(`/product/${suggestion.product?.id}`);
                                          setSearchQuery('');
                                          setShowSearchResults(false);
                                          setIsSearchOpen(false);
                                        }}
                                      >
                                        <img 
                                          src={suggestion.product?.image} 
                                          alt={suggestion.product?.name}
                                          className="w-10 h-10 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                          <div className="text-sm font-medium text-left">{suggestion.product?.name}</div>
                                          <div className="text-xs text-gray-500 text-left">{suggestion.product?.category}</div>
                                          <div className="text-xs text-gold font-semibold text-left">₹{suggestion.product?.basePrice?.toLocaleString()}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No suggestions found
                              </div>
                            );
                          } catch (error) {
                            console.error('Error rendering mobile suggestions:', error);
                            return (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                Search suggestions unavailable
                              </div>
                            );
                          }
                        })()}
                      </div>
                    )}

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-4">
                      {navigationLinks.map((link) => (
                        <NavLink
                          key={link.name}
                          to={link.href}
                          onClick={() => scrollToTop()}
                          className={({ isActive }) =>
                            `text-lg font-medium text-foreground hover:text-gold transition-colors duration-200 py-2 border-b border-border ${
                              isActive ? 'text-gold bg-gold/10 px-3 rounded-md' : ''
                            }`
                          }
                        >
                          {link.name}
                        </NavLink>
                      ))}
                    </nav>

                    {/* Mobile Account Actions */}
                    <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                      {isAuthenticated ? (
                        <>
                          <Button variant="outline" className="justify-start" disabled>
                            <User className="h-4 w-4 mr-2" />
                            {user?.name}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => { navigate('/wishlist'); scrollToTop(); }}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Wishlist ({wishlistCount})
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => { navigate('/cart'); scrollToTop(); }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Cart ({cartCount})
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => { navigate('/orders'); scrollToTop(); }}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            My Orders
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" className="justify-start" onClick={() => setIsAuthModalOpen(true)}>
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;