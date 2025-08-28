const API_BASE_URL = 'https://www.goldapi.io/api';
const API_KEY = 'goldapi-rrsmev3t6t9-io';

async function testNewApiKey() {
  try {
    console.log('🔍 Testing newly created API key: goldapi-rrsmev3t6t9-io\n');
    
    // Test Gold rates
    console.log('Testing Gold API...');
    const goldResponse = await fetch(`${API_BASE_URL}/XAU/INR`, {
      headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' }
    });
    
    if (goldResponse.ok) {
      const goldData = await goldResponse.json();
      console.log('✅ GOLD API SUCCESS:');
      console.log(`24k: ₹${Math.round(goldData.price_gram_24k)}/g`);
      console.log(`22k: ₹${Math.round(goldData.price_gram_22k || goldData.price_gram_24k * 0.916)}/g`);
      console.log(`18k: ₹${Math.round(goldData.price_gram_18k || goldData.price_gram_24k * 0.75)}/g\n`);
    } else {
      console.log(`❌ Gold API failed with status: ${goldResponse.status}\n`);
    }
    
    // Wait 2 seconds between calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test Silver rates
    console.log('Testing Silver API...');
    const silverResponse = await fetch(`${API_BASE_URL}/XAG/INR`, {
      headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' }
    });
    
    if (silverResponse.ok) {
      const silverData = await silverResponse.json();
      const pricePerGram = silverData.price / 31.1035;
      console.log('✅ SILVER API SUCCESS:');
      console.log(`Pure: ₹${Math.round(pricePerGram)}/g`);
      console.log(`925: ₹${Math.round(pricePerGram * 0.925)}/g\n`);
    } else {
      console.log(`❌ Silver API failed with status: ${silverResponse.status}\n`);
    }
    
    // Wait 2 seconds between calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test Platinum rates
    console.log('Testing Platinum API...');
    const platinumResponse = await fetch(`${API_BASE_URL}/XPT/INR`, {
      headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' }
    });
    
    if (platinumResponse.ok) {
      const platinumData = await platinumResponse.json();
      const pricePerGram = platinumData.price / 31.1035;
      console.log('✅ PLATINUM API SUCCESS:');
      console.log(`Pure: ₹${Math.round(pricePerGram)}/g\n`);
    } else {
      console.log(`❌ Platinum API failed with status: ${platinumResponse.status}\n`);
    }
    
    console.log('🎯 API KEY TEST COMPLETE');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testNewApiKey();
