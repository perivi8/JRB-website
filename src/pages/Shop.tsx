import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Grid3X3, List, Star, Heart, ShoppingCart, Eye, ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { navigateToPage } from "@/utils/navigation";
import { AuthModal } from "@/components/AuthModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCTS } from "@/data/products";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { calculateDynamicPrice, calculateCompareAtPrice } from "@/utils/priceCalculator";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Shop = () => {
  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([1000, 100000]);
  const [weightRange, setWeightRange] = useState([1, 50]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    categories: [] as string[],
    purities: [] as string[],
  });

  const { addToCart, addToWishlist, isInCart, isInWishlist, removeFromWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { goldRates, silverRates, platinumRates } = useGoldPrice();

  // Convert PRODUCTS to match the expected format for filtering with dynamic pricing
  const products = PRODUCTS.map(product => {
    const dynamicPrice = calculateDynamicPrice(product, goldRates, silverRates, platinumRates);
    const dynamicCompareAtPrice = calculateCompareAtPrice(product, goldRates, silverRates, platinumRates);
    
    return {
      ...product,
      price: dynamicPrice,
      compareAtPrice: dynamicCompareAtPrice,
      category: product.category.toLowerCase().includes('coin') ? 'coins' :
                product.category.toLowerCase().includes('gold') ? 'gold' : 
                product.category.toLowerCase().includes('silver') ? 'silver' :
                product.category.toLowerCase().includes('diamond') ? 'diamond' :
                product.category.toLowerCase().includes('platinum') ? 'platinum' : 'other',
      purity: product.category.includes('24k') ? '24k' :
              product.category.includes('22k') ? '22k' :
              product.category.includes('18k') ? '18k' :
              product.category.includes('Silver') ? 'pure-silver' :
              product.category.includes('Platinum') ? 'platinum' : '22k',
      makingCharges: Math.round(dynamicPrice * 0.05), // 5% of dynamic price as making charges
      sku: `JRB-${product.id.padStart(3, '0')}`
    };
  });

  // Update categories and purities based on actual products
  const categories = [
    { id: 'gold', name: 'Gold Jewelry', count: products.filter(p => p.category === 'gold').length },
    { id: 'silver', name: 'Silver Jewelry', count: products.filter(p => p.category === 'silver').length },
    { id: 'coins', name: 'Gold Coins', count: products.filter(p => p.category === 'coins').length },
    { id: 'diamond', name: 'Diamond Jewelry', count: products.filter(p => p.category === 'diamond').length },
    { id: 'platinum', name: 'Platinum Jewelry', count: products.filter(p => p.category === 'platinum').length },
  ];

  const purities = [
    { id: '24k', name: '24K Gold', count: products.filter(p => p.purity === '24k').length },
    { id: '22k', name: '22K Gold', count: products.filter(p => p.purity === '22k').length },
    { id: '18k', name: '18K Gold', count: products.filter(p => p.purity === '18k').length },
    { id: 'pure-silver', name: 'Pure Silver', count: products.filter(p => p.purity === 'pure-silver').length },
    { id: 'platinum', name: 'Platinum', count: products.filter(p => p.purity === 'platinum').length },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBadgeText = (badge: string) => {
    const badgeMap: { [key: string]: string } = {
      "no-wastage": "No Wastage",
      "new": "New",
      "sale": "Sale",
      "certified": "Certified",
      "handcrafted": "Handcrafted",
      "premium": "Premium",
      "traditional": "Traditional"
    };
    return badgeMap[badge] || badge;
  };

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

  const toggleFilter = (type: 'categories' | 'purities', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({ categories: [], purities: [] });
    setPriceRange([1000, 100000]);
    setWeightRange([1, 50]);
    setSearchQuery('');
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.purities.length > 0 || 
                          priceRange[0] !== 1000 || 
                          priceRange[1] !== 100000 ||
                          weightRange[0] !== 1 || 
                          weightRange[1] !== 50 ||
                          searchQuery.trim() !== '';

  const filteredProducts = products.filter(product => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        product.name,
        product.description,
        product.category,
        product.purity,
        ...(product.badges || []),
        ...(product.features || []),
        product.sku
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Purity filter
    if (filters.purities.length > 0 && !filters.purities.includes(product.purity)) {
      return false;
    }

    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Weight range filter
    if (product.weight < weightRange[0] || product.weight > weightRange[1]) {
      return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.rating.count - a.rating.count;
      case 'newest':
      default:
        return 0;
    }
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => toggleFilter('categories', category.id)}
              />
              <label
                htmlFor={category.id}
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {category.name} ({category.count})
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Purity */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Purity</h3>
        <div className="space-y-2">
          {purities.map((purity) => (
            <div key={purity.id} className="flex items-center space-x-2">
              <Checkbox
                id={purity.id}
                checked={filters.purities.includes(purity.id)}
                onCheckedChange={() => toggleFilter('purities', purity.id)}
              />
              <label
                htmlFor={purity.id}
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {purity.name} ({purity.count})
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">
          Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={100000}
          min={1000}
          step={1000}
          className="w-full"
        />
      </div>

      {/* Weight Range */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">
          Weight Range: {weightRange[0]}g - {weightRange[1]}g
        </h3>
        <Slider
          value={weightRange}
          onValueChange={setWeightRange}
          max={50}
          min={1}
          step={0.5}
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-display font-playfair text-foreground mb-4">
            Jewelry Collection
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover our exquisite collection of gold and silver jewelry
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search jewelry, gold, silver, diamonds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="divider-gold mt-4 max-w-24" />
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="card-luxury p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title font-playfair text-foreground">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <FilterContent />
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Results Counter */}
                <span className="text-sm text-muted-foreground">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
                  {hasActiveFilters && ' (filtered)'}
                </span>
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="flex items-center justify-between">
                        Filters
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                          >
                            Clear All
                          </Button>
                        )}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="hidden sm:flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.categories.length > 0 || filters.purities.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map(category => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleFilter('categories', category)}
                  >
                    {categories.find(c => c.id === category)?.name} ×
                  </Badge>
                ))}
                {filters.purities.map(purity => (
                  <Badge
                    key={purity}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleFilter('purities', purity)}
                  >
                    {purities.find(p => p.id === purity)?.name} ×
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid/List */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {sortedProducts.map((product) => (
                <Card key={product.id} className={`card-luxury group cursor-pointer ${viewMode === 'grid' ? 'h-full flex flex-col' : ''}`}>
                  <CardContent className={viewMode === 'grid' ? "p-0 flex flex-col h-full" : "p-6"}>
                    {viewMode === 'grid' ? (
                      // Grid View
                      <>
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
                          {product.badges && product.badges.length > 0 && (
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                              {product.badges.map((badge) => (
                                <Badge
                                  key={badge}
                                  variant={getBadgeVariant(badge)}
                                  className="text-xs"
                                >
                                  {getBadgeText(badge)}
                                </Badge>
                              ))}
                            </div>
                          )}

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

                        <div className="p-6 flex flex-col flex-1">
                          <div className="mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{product.purity}</p>
                          </div>

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
                      </>
                    ) : (
                      // List View
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{product.purity} • SKU: {product.sku}</p>
                            </div>
                            
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
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {product.rating && (
                                <div className="flex items-center">
                                  <div className="flex mr-1">
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
                                  <span className="text-xs text-muted-foreground">
                                    ({product.rating.count})
                                  </span>
                                </div>
                              )}
                              
                              <span className="text-xs text-muted-foreground">
                                Weight: {product.weight}g
                              </span>
                              
                              <span className="text-xs text-muted-foreground">
                                Making: {formatPrice(product.makingCharges)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleWishlistToggle(product)}
                              >
                                <Heart 
                                  className={`h-4 w-4 ${
                                    isInWishlist(product.id) ? 'fill-current text-red-500' : ''
                                  }`} 
                                />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleViewProduct(product.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="hero"
                                onClick={() => handleAddToCart(product)}
                                disabled={isInCart(product.id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More / Pagination */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-8">
                <Button size="lg" variant="outline-gold">
                  Load More Products
                </Button>
              </div>
            )}

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No products found matching your criteria
                </p>
                <Button
                  variant="outline-gold"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Shop;