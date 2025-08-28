import { GoldRates, SilverRates, PlatinumRates } from '@/hooks/useGoldPrice';

export interface ProductPricing {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  compareAtPrice?: number;
  weight: number;
  karat?: '24k' | '22k' | '18k';
  silverPurity?: 'pure' | '925';
  platinumPurity?: 'pure';
  makingCharges?: number;
  image: string;
  rating: { avg: number; count: number };
  badges: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
}

export const calculateDynamicPrice = (
  product: ProductPricing,
  goldRates: GoldRates | null,
  silverRates: SilverRates | null = null,
  platinumRates: PlatinumRates | null = null
): number => {
  // Handle gold products
  if (product.karat && goldRates) {
    const currentGoldRate = goldRates[product.karat];
    const goldValue = currentGoldRate * product.weight;
    const makingChargesAmount = goldValue * ((product.makingCharges || 0) / 100);
    return Math.round(goldValue + makingChargesAmount);
  }
  
  // Handle silver products
  if (product.silverPurity && silverRates) {
    const currentSilverRate = silverRates[product.silverPurity];
    const silverValue = currentSilverRate * product.weight;
    const makingChargesAmount = silverValue * ((product.makingCharges || 0) / 100);
    return Math.round(silverValue + makingChargesAmount);
  }
  
  // Handle platinum products
  if (product.platinumPurity && platinumRates) {
    const currentPlatinumRate = platinumRates[product.platinumPurity];
    const platinumValue = currentPlatinumRate * product.weight;
    const makingChargesAmount = platinumValue * ((product.makingCharges || 0) / 100);
    return Math.round(platinumValue + makingChargesAmount);
  }
  
  // For other metals, return base price
  return product.basePrice;
};

export const calculateCompareAtPrice = (
  product: ProductPricing,
  goldRates: GoldRates | null,
  silverRates: SilverRates | null = null,
  platinumRates: PlatinumRates | null = null
): number | undefined => {
  if (!product.compareAtPrice) return undefined;
  
  // Calculate the ratio between compare price and base price
  const priceRatio = product.compareAtPrice / product.basePrice;
  const dynamicPrice = calculateDynamicPrice(product, goldRates, silverRates, platinumRates);
  
  return Math.round(dynamicPrice * priceRatio);
};
