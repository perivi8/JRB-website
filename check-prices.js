const API_BASE_URL = 'https://www.goldapi.io/api';
const API_KEY = 'goldapi-rrsmeux7430-io';

async function checkRates() {
  try {
    console.log('🔍 Checking current API rates...\n');
    
    // Check Gold rates
    const goldResponse = await fetch(`${API_BASE_URL}/XAU/INR`, {
      headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' }
    });
    
    if (goldResponse.ok) {
      const goldData = await goldResponse.json();
      console.log('✅ GOLD RATES:');
      console.log(`24k: ₹${Math.round(goldData.price_gram_24k)}/g`);
      console.log(`22k: ₹${Math.round(goldData.price_gram_22k || goldData.price_gram_24k * 0.916)}/g`);
      console.log(`18k: ₹${Math.round(goldData.price_gram_18k || goldData.price_gram_24k * 0.75)}/g\n`);
      
      // Calculate sample product prices
      console.log('📊 SAMPLE GOLD PRODUCT CALCULATIONS:');
      
      // Gold Bangle (22k, 8.5g, 15% making)
      const bangleGoldValue = Math.round(goldData.price_gram_22k || goldData.price_gram_24k * 0.916) * 8.5;
      const bangleMaking = bangleGoldValue * 0.15;
      console.log(`Gold Bangle (22k, 8.5g): ₹${Math.round(bangleGoldValue + bangleMaking)}`);
      
      // Gold Coin (24k, 2.0g, 3% making)
      const coinGoldValue = Math.round(goldData.price_gram_24k) * 2.0;
      const coinMaking = coinGoldValue * 0.03;
      console.log(`Gold Coin (24k, 2.0g): ₹${Math.round(coinGoldValue + coinMaking)}`);
      
      console.log('');
    } else {
      console.log('❌ Gold API failed with status:', goldResponse.status);
    }
    
    // Wait 2 seconds to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check Silver rates
    const silverResponse = await fetch(`${API_BASE_URL}/XAG/INR`, {
      headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' }
    });
    
    if (silverResponse.ok) {
      const silverData = await silverResponse.json();
      const pricePerGram = silverData.price / 31.1035;
      console.log('✅ SILVER RATES:');
      console.log(`Pure: ₹${Math.round(pricePerGram)}/g`);
      console.log(`925: ₹${Math.round(pricePerGram * 0.925)}/g\n`);
      
      // Calculate sample silver product
      console.log('📊 SAMPLE SILVER PRODUCT CALCULATIONS:');
      const necklaceSilverValue = Math.round(pricePerGram * 0.925) * 25.0;
      const necklaceMaking = necklaceSilverValue * 0.12;
      console.log(`Silver Necklace (925, 25g): ₹${Math.round(necklaceSilverValue + necklaceMaking)}\n`);
    } else {
      console.log('❌ Silver API failed with status:', silverResponse.status);
    }
    
    // Wait 2 seconds to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check Platinum rates
    const platinumResponse = await fetch(`${API_BASE_URL}/XPT/INR`, {
      headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' }
    });
    
    if (platinumResponse.ok) {
      const platinumData = await platinumResponse.json();
      const pricePerGram = platinumData.price / 31.1035;
      console.log('✅ PLATINUM RATES:');
      console.log(`Pure: ₹${Math.round(pricePerGram)}/g\n`);
      
      // Calculate sample platinum products
      console.log('📊 SAMPLE PLATINUM PRODUCT CALCULATIONS:');
      const weddingBandValue = Math.round(pricePerGram) * 4.5;
      const weddingBandMaking = weddingBandValue * 0.15;
      console.log(`Wedding Band (4.5g): ₹${Math.round(weddingBandValue + weddingBandMaking)}`);
      
      const solitaireValue = Math.round(pricePerGram) * 3.8;
      const solitaireMaking = solitaireValue * 0.20;
      console.log(`Solitaire Ring (3.8g): ₹${Math.round(solitaireValue + solitaireMaking)}`);
      
      const chainValue = Math.round(pricePerGram) * 8.2;
      const chainMaking = chainValue * 0.12;
      console.log(`Chain Necklace (8.2g): ₹${Math.round(chainValue + chainMaking)}\n`);
    } else {
      console.log('❌ Platinum API failed with status:', platinumResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Error checking rates:', error.message);
  }
}

checkRates();
