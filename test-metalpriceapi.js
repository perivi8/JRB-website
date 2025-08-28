// Test MetalpriceAPI - free tier without API key
const BASE_URL = 'https://api.metalpriceapi.com/v1';

async function testMetalPriceAPI() {
  try {
    console.log('🔍 Testing MetalpriceAPI (free tier)\n');
    
    // Test latest rates endpoint
    console.log('Testing latest rates...');
    const response = await fetch(`${BASE_URL}/latest?base=USD&currencies=XAU,XAG,XPT`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API SUCCESS:');
      console.log('Raw response:', JSON.stringify(data, null, 2));
      
      if (data.rates) {
        // Convert to INR rates per gram
        const usdToInr = 83; // Approximate USD to INR rate
        
        if (data.rates.XAU) {
          const goldPerOunce = 1 / data.rates.XAU; // USD per ounce
          const goldPerGram = (goldPerOunce / 31.1035) * usdToInr; // INR per gram
          console.log(`\nGold (24k): ₹${Math.round(goldPerGram)}/g`);
          console.log(`Gold (22k): ₹${Math.round(goldPerGram * 0.916)}/g`);
          console.log(`Gold (18k): ₹${Math.round(goldPerGram * 0.75)}/g`);
        }
        
        if (data.rates.XAG) {
          const silverPerOunce = 1 / data.rates.XAG; // USD per ounce
          const silverPerGram = (silverPerOunce / 31.1035) * usdToInr; // INR per gram
          console.log(`\nSilver (Pure): ₹${Math.round(silverPerGram)}/g`);
          console.log(`Silver (925): ₹${Math.round(silverPerGram * 0.925)}/g`);
        }
        
        if (data.rates.XPT) {
          const platinumPerOunce = 1 / data.rates.XPT; // USD per ounce
          const platinumPerGram = (platinumPerOunce / 31.1035) * usdToInr; // INR per gram
          console.log(`\nPlatinum (Pure): ₹${Math.round(platinumPerGram)}/g`);
        }
      }
    } else {
      console.log(`❌ API failed with status: ${response.status}`);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testMetalPriceAPI();
