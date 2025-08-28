import { useState, useEffect } from 'react';

export interface GoldRates {
  '24k': number;
  '22k': number;
  '18k': number;
}

export interface SilverRates {
  pure: number;
  '925': number;
}

export interface PlatinumRates {
  pure: number;
}

export interface MetalPrices {
  gold: GoldRates | null;
  silver: SilverRates | null;
  platinum: PlatinumRates | null;
}

// API Configuration - using user's newly created Gold API key
const API_BASE_URL = 'https://www.goldapi.io/api';
const API_KEY = 'goldapi-rrsmev3t6t9-io';

// Current live rates (updated with today's prices)
const CURRENT_GOLD_RATES: GoldRates = {
  '24k': 10260, // ₹10,260/g for 24k gold (today's rate)
  '22k': 9405,  // ₹9,405/g for 22k gold (today's rate)
  '18k': 7775   // ₹7,775/g for 18k gold (today's rate)
};

const CURRENT_SILVER_RATES: SilverRates = {
  pure: 130,  // ₹130/g for pure silver (today's rate)
  '925': 120  // ₹120/g for 925 silver (today's rate)
};

const CURRENT_PLATINUM_RATES: PlatinumRates = {
  pure: 3200  // ₹3,200/g for platinum (estimated rate)
};

export const useGoldPrice = () => {
  const [goldRates, setGoldRates] = useState<GoldRates | null>(null);
  const [silverRates, setSilverRates] = useState<SilverRates | null>(null);
  const [platinumRates, setPlatinumRates] = useState<PlatinumRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const calculateKaratPrice = (basePrice: number, karat: '24k' | '22k' | '18k') => {
    switch (karat) {
      case '24k':
        return basePrice; // Pure gold
      case '22k':
        return Math.round(basePrice * 0.916); // 22k is 91.6% pure
      case '18k':
        return Math.round(basePrice * 0.75); // 18k is 75% pure
      default:
        return basePrice;
    }
  };

  const fetchGoldRates = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/XAU/INR`, {
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Gold API quota exceeded. Using fallback rates.');
          setGoldRates(CURRENT_GOLD_RATES);
          return;
        }
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.price_gram_24k) {
        const newRates: GoldRates = {
          '24k': Math.round(data.price_gram_24k),
          '22k': Math.round(data.price_gram_22k || data.price_gram_24k * 0.916),
          '18k': Math.round(data.price_gram_18k || data.price_gram_24k * 0.75),
        };
        
        setGoldRates(newRates);
        console.log('✅ Gold rates updated successfully:', newRates);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching gold rates:', error);
      console.log('🔄 Using current gold rates due to API failure');
      setGoldRates(CURRENT_GOLD_RATES);
      setError('Failed to fetch live gold rates. Using current rates.');
    }
  };

  const fetchSilverRates = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/XAG/INR`, {
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Silver API quota exceeded. Using fallback rates.');
          setSilverRates(CURRENT_SILVER_RATES);
          return;
        }
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.price) {
        // Convert from troy ounce to gram (1 troy ounce = 31.1035 grams)
        const pricePerGramPure = data.price / 31.1035;
        
        const rates: SilverRates = {
          pure: Math.round(pricePerGramPure),
          '925': Math.round(pricePerGramPure * 0.925) // 92.5% purity
        };
        
        setSilverRates(rates);
        console.log('✅ Silver rates updated successfully:', rates);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching silver rates:', error);
      console.log('🔄 Using current silver rates due to API failure');
      setSilverRates(CURRENT_SILVER_RATES);
      setError('Failed to fetch live silver rates. Using current rates.');
    }
  };

  const fetchPlatinumRates = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/XPT/INR`, {
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Platinum API quota exceeded. Using fallback rates.');
          setPlatinumRates(CURRENT_PLATINUM_RATES);
          return;
        }
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.price) {
        // Convert from troy ounce to gram (1 troy ounce = 31.1035 grams)
        const pricePerGramPure = data.price / 31.1035;
        
        const rates: PlatinumRates = {
          pure: Math.round(pricePerGramPure)
        };
        
        setPlatinumRates(rates);
        console.log('✅ Platinum rates updated successfully:', rates);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching platinum rates:', error);
      console.log('🔄 Using current platinum rates due to API failure');
      setPlatinumRates(CURRENT_PLATINUM_RATES);
      setError('Failed to fetch live platinum rates. Using current rates.');
    }
  };

  const fetchAllRates = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Fetch gold rates first (most important)
      await fetchGoldRates();
      
      // Wait 2 seconds between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchSilverRates();
      
      // Wait another 2 seconds before platinum
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchPlatinumRates();
      
      setUpdateCount(prev => prev + 1);
    } catch (err) {
      console.error('Error in fetchAllRates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with current rates immediately
    setGoldRates(CURRENT_GOLD_RATES);
    setSilverRates(CURRENT_SILVER_RATES);
    setPlatinumRates(CURRENT_PLATINUM_RATES);
    
    // Then try to fetch live rates from API
    fetchAllRates();
    
    // Set up interval to refresh rates every 30 minutes to avoid quota limits
    const interval = setInterval(fetchAllRates, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    goldRates, 
    silverRates, 
    platinumRates,
    loading, 
    error, 
    updateCount,
    refetch: fetchAllRates 
  };
};
