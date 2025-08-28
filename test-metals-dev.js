// Test Metals.dev API - requires API key but let's try without first
const BASE_URL = 'https://api.metals.dev/v1';

async function testMetalsDevAPI() {
  try {
    console.log('🔍 Testing Metals.dev API\n');
    
    // Try without API key first
    console.log('Testing without API key...');
    const response = await fetch(`${BASE_URL}/metal/spot?metal=gold&currency=USD`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API SUCCESS (no key needed):');
      console.log('Raw response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ API failed with status: ${response.status}`);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
    // Try the main endpoint that might work without key
    console.log('\nTesting main endpoint...');
    const mainResponse = await fetch(`${BASE_URL}/metal`);
    
    if (mainResponse.ok) {
      const mainData = await mainResponse.json();
      console.log('✅ Main endpoint SUCCESS:');
      console.log('Raw response:', JSON.stringify(mainData, null, 2));
      
      if (mainData.metals) {
        // Convert to INR rates per gram
        const usdToInr = 83; // Approximate USD to INR rate
        
        if (mainData.metals.gold) {
          const goldPerOunce = mainData.metals.gold; // USD per ounce
          const goldPerGram = (goldPerOunce / 31.1035) * usdToInr; // INR per gram
          console.log(`\nGold (24k): ₹${Math.round(goldPerGram)}/g`);
          console.log(`Gold (22k): ₹${Math.round(goldPerGram * 0.916)}/g`);
          console.log(`Gold (18k): ₹${Math.round(goldPerGram * 0.75)}/g`);
        }
        
        if (mainData.metals.silver) {
          const silverPerOunce = mainData.metals.silver; // USD per ounce
          const silverPerGram = (silverPerOunce / 31.1035) * usdToInr; // INR per gram
          console.log(`\nSilver (Pure): ₹${Math.round(silverPerGram)}/g`);
          console.log(`Silver (925): ₹${Math.round(silverPerGram * 0.925)}/g`);
        }
        
        if (mainData.metals.platinum) {
          const platinumPerOunce = mainData.metals.platinum; // USD per ounce
          const platinumPerGram = (platinumPerOunce / 31.1035) * usdToInr; // INR per gram
          console.log(`\nPlatinum (Pure): ₹${Math.round(platinumPerGram)}/g`);
        }
      }
    } else {
      console.log(`❌ Main endpoint failed with status: ${mainResponse.status}`);
      const errorText = await mainResponse.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testMetalsDevAPI();
