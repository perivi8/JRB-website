import productBangle from "@/assets/product-bangle.jpg";
import productCoin from "@/assets/product-coin.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import heroJewelry from "@/assets/hero-jewelry.jpg";
import goldCollection from "@/assets/gold-collection.jpg";
import craftsmanship from "@/assets/craftsmanship.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number; // Base price for calculation
  compareAtPrice?: number;
  weight: number;
  karat?: '24k' | '22k' | '18k'; // Gold purity for dynamic pricing
  silverPurity?: 'pure' | '925'; // Silver purity for dynamic pricing
  platinumPurity?: 'pure'; // Platinum purity for dynamic pricing
  makingCharges?: number; // Making charges percentage
  image: string;
  rating: { avg: number; count: number };
  badges: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Elegant Gold Bangle",
    category: "22k Gold Bangles",
    basePrice: 45200,
    compareAtPrice: 48500,
    weight: 8.5,
    karat: '22k',
    makingCharges: 15,
    image: productBangle,
    rating: { avg: 4.8, count: 124 },
    badges: ["no-wastage", "new"],
    description: "A stunning 22k gold bangle featuring intricate traditional designs. Perfect for special occasions and celebrations. Handcrafted by skilled artisans with attention to every detail.",
    specifications: {
      "Metal Purity": "22k Gold (916 Hallmark)",
      "Weight": "8.5 grams",
      "Width": "12mm",
      "Diameter": "2.4 inches",
      "Clasp Type": "Hinged opening",
      "Finish": "High polish",
      "Certification": "BIS Hallmarked"
    },
    features: [
      "BIS Hallmarked for purity guarantee",
      "Traditional handcrafted design",
      "Comfortable fit for daily wear",
      "No making charges policy",
      "Lifetime exchange guarantee"
    ],
    inStock: true
  },
  {
    id: "2",
    name: "Pure Gold Coin - Lakshmi",
    category: "24k Gold Coins",
    basePrice: 7850,
    weight: 2.0,
    karat: '24k',
    makingCharges: 3,
    image: productCoin,
    rating: { avg: 4.9, count: 256 },
    badges: ["certified", "investment"],
    description: "Pure 24k gold coin featuring Goddess Lakshmi design. Perfect for gifting and investment purposes. Comes with authenticity certificate.",
    specifications: {
      "Metal Purity": "24k Gold (999 Fineness)",
      "Weight": "2.0 grams",
      "Diameter": "20mm",
      "Thickness": "1.5mm",
      "Design": "Goddess Lakshmi",
      "Certification": "MMTC-PAMP Certified",
      "Packaging": "Tamper-proof assay card"
    },
    features: [
      "999 purity certified gold",
      "MMTC-PAMP authentication",
      "Investment grade quality",
      "Tamper-proof packaging",
      "Buyback guarantee available"
    ],
    inStock: true
  },
  {
    id: "3",
    name: "Silver Temple Necklace",
    category: "Pure Silver Jewelry",
    basePrice: 3200,
    weight: 25.0,
    silverPurity: '925',
    makingCharges: 12,
    image: productNecklace,
    rating: { avg: 4.7, count: 89 },
    badges: ["handcrafted", "traditional"],
    description: "Exquisite pure silver necklace with traditional temple design motifs. Handcrafted by master artisans using age-old techniques.",
    specifications: {
      "Metal Purity": "92.5% Sterling Silver",
      "Weight": "25.0 grams",
      "Length": "16 inches",
      "Pendant Size": "3cm x 2cm",
      "Chain Type": "Box chain",
      "Clasp": "Spring ring clasp",
      "Finish": "Oxidized antique"
    },
    features: [
      "Sterling silver 925 quality",
      "Traditional temple artwork",
      "Handcrafted by artisans",
      "Antique oxidized finish",
      "Adjustable chain length"
    ],
    inStock: true
  },
  {
    id: "4",
    name: "Diamond Gold Ring Set",
    category: "22k Diamond Jewelry",
    basePrice: 32400,
    compareAtPrice: 35200,
    weight: 6.2,
    karat: '22k',
    makingCharges: 20,
    image: heroJewelry,
    rating: { avg: 4.8, count: 67 },
    badges: ["no-wastage", "sale", "premium"],
    description: "Elegant set of two matching rings in 22k gold with natural diamonds. Perfect for engagements or as a gift set.",
    specifications: {
      "Metal Purity": "22k Gold (916 Hallmark)",
      "Total Weight": "6.2 grams",
      "Diamond Quality": "VS-SI, F-G Color",
      "Total Diamonds": "12 pieces (0.24 carat)",
      "Ring Sizes": "Adjustable 14-18",
      "Setting": "Prong setting",
      "Certification": "IGI Certified diamonds"
    },
    features: [
      "Natural diamond certification",
      "Matching pair design",
      "Adjustable ring sizes",
      "Premium gift packaging",
      "Free resizing service"
    ],
    inStock: true
  },
  {
    id: "5",
    name: "Gold Chain - Rope Design",
    category: "22k Gold Chains",
    basePrice: 52800,
    weight: 10.5,
    karat: '22k',
    makingCharges: 8,
    image: goldCollection,
    rating: { avg: 4.9, count: 143 },
    badges: ["premium", "bestseller"],
    description: "Classic rope design gold chain in 22k purity. Versatile piece suitable for both casual and formal occasions.",
    specifications: {
      "Metal Purity": "22k Gold (916 Hallmark)",
      "Weight": "10.5 grams",
      "Length": "20 inches",
      "Width": "3mm",
      "Chain Type": "Rope design",
      "Clasp": "Lobster clasp",
      "Finish": "High polish mirror finish"
    },
    features: [
      "Durable rope construction",
      "Mirror finish polish",
      "Secure lobster clasp",
      "Suitable for pendants",
      "Lifetime maintenance"
    ],
    inStock: true
  },
  {
    id: "6",
    name: "Silver Antique Bracelet",
    category: "Pure Silver Jewelry",
    basePrice: 2800,
    weight: 18.0,
    silverPurity: '925',
    makingCharges: 10,
    image: craftsmanship,
    rating: { avg: 4.6, count: 52 },
    badges: ["handcrafted", "antique"],
    description: "Vintage-inspired silver bracelet with intricate filigree work. Each piece is unique and handcrafted by skilled artisans.",
    specifications: {
      "Metal Purity": "92.5% Sterling Silver",
      "Weight": "18.0 grams",
      "Length": "7.5 inches",
      "Width": "15mm",
      "Design": "Filigree work",
      "Clasp": "Toggle clasp",
      "Finish": "Antique patina"
    },
    features: [
      "Unique filigree artwork",
      "Vintage antique finish",
      "Comfortable toggle clasp",
      "Handmade craftsmanship",
      "Adjustable sizing available"
    ],
    inStock: true
  },
  {
    id: "7",
    name: "Gold Earrings - Jhumka Style",
    category: "22k Gold Earrings",
    basePrice: 28500,
    weight: 5.8,
    karat: '22k',
    makingCharges: 18,
    image: productBangle,
    rating: { avg: 4.7, count: 98 },
    badges: ["traditional", "handcrafted"],
    description: "Traditional jhumka style earrings in 22k gold with intricate bell design. Perfect for festivals and special occasions.",
    specifications: {
      "Metal Purity": "22k Gold (916 Hallmark)",
      "Weight": "5.8 grams",
      "Length": "4cm",
      "Width": "2.5cm",
      "Style": "Traditional Jhumka",
      "Back Type": "Screw back",
      "Finish": "Textured gold"
    },
    features: [
      "Traditional jhumka design",
      "Secure screw back closure",
      "Lightweight comfortable wear",
      "Festival special design",
      "Matching necklace available"
    ],
    inStock: true
  },
  {
    id: "8",
    name: "Platinum Wedding Band",
    category: "Platinum Jewelry",
    basePrice: 45000,
    weight: 4.5,
    platinumPurity: 'pure',
    makingCharges: 15,
    image: heroJewelry,
    rating: { avg: 4.9, count: 76 },
    badges: ["premium", "wedding", "lifetime"],
    description: "Classic platinum wedding band with brushed finish. Hypoallergenic and perfect for everyday wear.",
    specifications: {
      "Metal Purity": "95% Platinum (Pt950)",
      "Weight": "4.5 grams",
      "Width": "4mm",
      "Thickness": "1.5mm",
      "Finish": "Brushed matte",
      "Ring Size": "Customizable",
      "Certification": "Platinum Guild certified"
    },
    features: [
      "Hypoallergenic platinum",
      "Lifetime durability",
      "Comfortable fit design",
      "Free engraving service",
      "Lifetime warranty"
    ],
    inStock: true
  },
  {
    id: "9",
    name: "Gold Pendant - Om Symbol",
    category: "22k Gold Pendants",
    basePrice: 15600,
    weight: 3.2,
    karat: '22k',
    makingCharges: 12,
    image: goldCollection,
    rating: { avg: 4.8, count: 134 },
    badges: ["spiritual", "gifting"],
    description: "Sacred Om symbol pendant in 22k gold. Perfect for spiritual wear and as a meaningful gift.",
    specifications: {
      "Metal Purity": "22k Gold (916 Hallmark)",
      "Weight": "3.2 grams",
      "Height": "2.5cm",
      "Width": "2cm",
      "Design": "Om Symbol",
      "Bail Size": "5mm",
      "Finish": "High polish"
    },
    features: [
      "Sacred Om symbol design",
      "Spiritual significance",
      "Perfect gifting option",
      "Suitable for all chains",
      "Religious blessing included"
    ],
    inStock: true
  },
  {
    id: "10",
    name: "Diamond Stud Earrings",
    category: "Diamond Jewelry",
    basePrice: 38900,
    weight: 2.1,
    karat: '18k',
    makingCharges: 25,
    image: craftsmanship,
    rating: { avg: 4.9, count: 187 },
    badges: ["diamond", "premium", "certified"],
    description: "Classic diamond stud earrings in 18k white gold. Perfect for daily wear and special occasions.",
    specifications: {
      "Metal": "18k White Gold",
      "Total Weight": "2.1 grams",
      "Diamond Weight": "0.50 carat total",
      "Diamond Quality": "VS1-VS2, F-G Color",
      "Setting": "4-prong setting",
      "Back Type": "Push back",
      "Certification": "GIA Certified"
    },
    features: [
      "GIA certified diamonds",
      "18k white gold setting",
      "Classic timeless design",
      "Secure push back closure",
      "Certificate of authenticity"
    ],
    inStock: true
  },
  {
    id: "11",
    name: "Gold Mangalsutra Chain",
    category: "22k Gold Chains",
    basePrice: 42300,
    weight: 8.8,
    karat: '22k',
    makingCharges: 10,
    image: productNecklace,
    rating: { avg: 4.8, count: 156 },
    badges: ["traditional", "sacred", "handcrafted"],
    description: "Traditional mangalsutra chain in 22k gold with black beads. Sacred jewelry for married women.",
    specifications: {
      "Metal Purity": "22k Gold (916 Hallmark)",
      "Weight": "8.8 grams",
      "Length": "24 inches",
      "Bead Type": "Natural black onyx",
      "Chain Style": "Traditional pattern",
      "Clasp": "Hook clasp",
      "Pendant": "Included"
    },
    features: [
      "Sacred traditional design",
      "Natural black onyx beads",
      "Adjustable length",
      "Matching pendant included",
      "Blessed by priests"
    ],
    inStock: true
  },
  {
    id: "12",
    name: "Silver Anklet Pair",
    category: "Pure Silver Jewelry",
    basePrice: 4200,
    weight: 32.0,
    silverPurity: '925',
    makingCharges: 8,
    image: productBangle,
    rating: { avg: 4.6, count: 73 },
    badges: ["pair", "traditional", "handcrafted"],
    description: "Traditional silver anklet pair with ghungroo bells. Handcrafted with intricate patterns.",
    specifications: {
      "Metal Purity": "92.5% Sterling Silver",
      "Weight": "32.0 grams (pair)",
      "Length": "9.5 inches each",
      "Width": "8mm",
      "Bells": "12 ghungroos each",
      "Clasp": "S-hook clasp",
      "Finish": "Oxidized silver"
    },
    features: [
      "Matching pair included",
      "Traditional ghungroo bells",
      "Comfortable fit design",
      "Adjustable sizing",
      "Cultural significance"
    ],
    inStock: true
  },
  {
    id: "13",
    name: "Platinum Solitaire Ring",
    category: "Platinum Jewelry",
    basePrice: 85000,
    weight: 3.8,
    platinumPurity: 'pure',
    makingCharges: 20,
    image: heroJewelry,
    rating: { avg: 4.9, count: 45 },
    badges: ["premium", "diamond", "engagement"],
    description: "Elegant platinum solitaire ring with brilliant cut diamond. Perfect for engagements and special occasions.",
    specifications: {
      "Metal Purity": "95% Platinum (Pt950)",
      "Weight": "3.8 grams",
      "Diamond Weight": "0.75 carat",
      "Diamond Quality": "VS1, F Color",
      "Setting": "6-prong solitaire",
      "Ring Size": "Customizable",
      "Certification": "GIA Certified diamond"
    },
    features: [
      "GIA certified diamond",
      "Platinum setting durability",
      "Classic solitaire design",
      "Free resizing service",
      "Lifetime warranty"
    ],
    inStock: true
  },
  {
    id: "14",
    name: "Platinum Chain Necklace",
    category: "Platinum Jewelry",
    basePrice: 65000,
    weight: 8.2,
    platinumPurity: 'pure',
    makingCharges: 12,
    image: goldCollection,
    rating: { avg: 4.8, count: 32 },
    badges: ["premium", "hypoallergenic"],
    description: "Premium platinum chain necklace with box link design. Hypoallergenic and perfect for sensitive skin.",
    specifications: {
      "Metal Purity": "95% Platinum (Pt950)",
      "Weight": "8.2 grams",
      "Length": "18 inches",
      "Width": "2.5mm",
      "Chain Type": "Box link",
      "Clasp": "Lobster clasp",
      "Finish": "High polish"
    },
    features: [
      "Hypoallergenic platinum",
      "Durable box link construction",
      "Secure lobster clasp",
      "Tarnish resistant",
      "Lifetime maintenance"
    ],
    inStock: true
  },
  {
    id: "15",
    name: "Platinum Stud Earrings",
    category: "Platinum Jewelry",
    basePrice: 42000,
    weight: 2.5,
    platinumPurity: 'pure',
    makingCharges: 18,
    image: craftsmanship,
    rating: { avg: 4.9, count: 28 },
    badges: ["premium", "hypoallergenic", "daily-wear"],
    description: "Simple yet elegant platinum stud earrings. Perfect for daily wear and hypoallergenic for sensitive ears.",
    specifications: {
      "Metal Purity": "95% Platinum (Pt950)",
      "Weight": "2.5 grams",
      "Diameter": "6mm",
      "Thickness": "2mm",
      "Back Type": "Butterfly back",
      "Finish": "Brushed matte",
      "Certification": "Platinum Guild certified"
    },
    features: [
      "Hypoallergenic platinum",
      "Comfortable daily wear",
      "Secure butterfly backs",
      "Brushed finish elegance",
      "Lifetime durability"
    ],
    inStock: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return PRODUCTS.filter(product => product.category.toLowerCase().includes(category.toLowerCase()));
};

export const getFeaturedProducts = (limit: number = 8): Product[] => {
  return PRODUCTS.slice(0, limit);
};

export const getProductsWithDynamicPricing = (goldRates: any) => {
  return PRODUCTS.map(product => {
    const { calculateDynamicPrice, calculateCompareAtPrice } = require('@/utils/priceCalculator');
    return {
      ...product,
      price: calculateDynamicPrice(product, goldRates),
      compareAtPrice: calculateCompareAtPrice(product, goldRates)
    };
  });
};
