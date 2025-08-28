import { calculateTax } from './taxCalculator';

// Test tax calculation with sample data
export const testTaxCalculation = () => {
  console.log('=== Tax Calculation Test ===');
  
  // Test Case 1: Gold item with making charges
  const goldItemPrice = 45200; // Gold bangle base price
  const makingCharges = 6780; // 15% making charges (45200 * 0.15)
  const subtotal = goldItemPrice + makingCharges;
  
  const taxBreakdown = calculateTax(subtotal, makingCharges);
  
  console.log('Test Case 1: Gold Bangle');
  console.log('Gold Value:', goldItemPrice);
  console.log('Making Charges:', makingCharges);
  console.log('Subtotal:', subtotal);
  console.log('Tax Breakdown:', {
    goldGST: Math.round((goldItemPrice * 0.03) * 100) / 100, // 3% on gold
    makingChargesGST: Math.round((makingCharges * 0.18) * 100) / 100, // 18% on making charges
    totalTax: taxBreakdown.totalTax,
    grandTotal: taxBreakdown.grandTotal
  });
  
  // Test Case 2: Multiple items
  console.log('\nTest Case 2: Multiple Items Cart');
  const item1 = { price: 45200, makingCharges: 6780 }; // Gold bangle
  const item2 = { price: 7850, makingCharges: 235.5 }; // Gold coin (3% making charges)
  
  const cartTotal = item1.price + item1.makingCharges + item2.price + item2.makingCharges;
  const totalMakingCharges = item1.makingCharges + item2.makingCharges;
  
  const multiItemTax = calculateTax(cartTotal, totalMakingCharges);
  
  console.log('Cart Total:', cartTotal);
  console.log('Total Making Charges:', totalMakingCharges);
  console.log('Multi-item Tax:', multiItemTax);
  
  return { singleItem: taxBreakdown, multiItem: multiItemTax };
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testTaxCalculation();
}
