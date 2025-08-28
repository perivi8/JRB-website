// Test script to check current live gold and silver prices from API
export const testLivePrices = async () => {
  console.log('=== Testing Live Gold & Silver Prices with API Key: goldapi-rrsmeux7430-io ===');
  
  try {
    // Test Gold API
    console.log('Fetching Gold prices from: https://www.goldapi.io/api/XAU/INR');
    const goldResponse = await fetch('https://www.goldapi.io/api/XAU/INR', {
      method: 'GET',
      headers: {
        'x-access-token': 'goldapi-rrsmeux7430-io',
        'Content-Type': 'application/json'
      }
    });
    
    if (goldResponse.ok) {
      const goldData = await goldResponse.json();
      console.log('=== GOLD API FULL RESPONSE ===');
      console.log(JSON.stringify(goldData, null, 2));
      
      // Show exact API price without any reduction
      const goldPricePerOunce = goldData.price;
      const goldPricePerGram = goldPricePerOunce / 31.1035;
      
      console.log(`\n=== GOLD PRICE BREAKDOWN ===`);
      console.log(`API Price per troy ounce: ₹${goldPricePerOunce.toFixed(2)}`);
      console.log(`Converted to per gram (÷31.1035): ₹${goldPricePerGram.toFixed(2)}`);
      console.log(`Currency: ${goldData.currency || 'INR'}`);
      console.log(`Metal: ${goldData.metal || 'XAU'}`);
      console.log(`Timestamp: ${goldData.timestamp || 'N/A'}`);
      
      // Calculate karat prices from exact API price
      console.log(`\n=== CALCULATED KARAT PRICES (No Reduction) ===`);
      console.log(`24k Gold: ₹${goldPricePerGram.toFixed(2)}/g`);
      console.log(`22k Gold: ₹${(goldPricePerGram * 0.916).toFixed(2)}/g`);
      console.log(`18k Gold: ₹${(goldPricePerGram * 0.75).toFixed(2)}/g`);
    } else {
      console.error(`Gold API Error: ${goldResponse.status} - ${goldResponse.statusText}`);
    }
    
    // Test Silver API
    console.log('\n\nFetching Silver prices from: https://www.goldapi.io/api/XAG/INR');
    const silverResponse = await fetch('https://www.goldapi.io/api/XAG/INR', {
      method: 'GET',
      headers: {
        'x-access-token': 'goldapi-rrsmeux7430-io',
        'Content-Type': 'application/json'
      }
    });
    
    if (silverResponse.ok) {
      const silverData = await silverResponse.json();
      console.log('=== SILVER API FULL RESPONSE ===');
      console.log(JSON.stringify(silverData, null, 2));
      
      const silverPricePerOunce = silverData.price;
      const silverPricePerGram = silverPricePerOunce / 31.1035;
      
      console.log(`\n=== SILVER PRICE BREAKDOWN ===`);
      console.log(`API Price per troy ounce: ₹${silverPricePerOunce.toFixed(2)}`);
      console.log(`Converted to per gram (÷31.1035): ₹${silverPricePerGram.toFixed(2)}`);
      console.log(`Currency: ${silverData.currency || 'INR'}`);
      console.log(`Metal: ${silverData.metal || 'XAG'}`);
      console.log(`Timestamp: ${silverData.timestamp || 'N/A'}`);
      
      console.log(`\n=== CALCULATED SILVER PRICES (No Reduction) ===`);
      console.log(`Pure Silver: ₹${silverPricePerGram.toFixed(2)}/g`);
      console.log(`925 Silver: ₹${(silverPricePerGram * 0.925).toFixed(2)}/g`);
    } else {
      console.error(`Silver API Error: ${silverResponse.status} - ${silverResponse.statusText}`);
    }
    
  } catch (error) {
    console.error('Error testing live prices:', error);
  }
};

// Auto-run test when imported
testLivePrices();

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).testLivePrices = testLivePrices;
  console.log('Run testLivePrices() in console to test current prices');
}
