export interface TaxRates {
  gst: number; // GST percentage
  makingChargesTax: number; // Tax on making charges
  cgst: number; // Central GST
  sgst: number; // State GST
  igst: number; // Integrated GST (for inter-state)
  cess: number; // Additional cess if applicable
  lastUpdated: string; // Date when rates were last updated
}

export interface TaxBreakdown {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  cess: number;
  totalTax: number;
  grandTotal: number;
  taxableAmount: number;
}

// Current tax rates for jewelry in India
export const getCurrentTaxRates = (): TaxRates => {
  return {
    gst: 3, // 3% GST on gold jewelry
    makingChargesTax: 18, // 18% GST on making charges
    cgst: 1.5, // 1.5% CGST
    sgst: 1.5, // 1.5% SGST
    igst: 3, // 3% IGST for inter-state
    cess: 0, // Currently no cess on gold
    lastUpdated: new Date().toISOString().split('T')[0]
  };
};

export const calculateTax = (
  subtotal: number,
  makingCharges: number = 0,
  isInterState: boolean = false
): TaxBreakdown => {
  const rates = getCurrentTaxRates();
  
  // Calculate GST on gold value (excluding making charges)
  const goldValue = subtotal - makingCharges;
  const goldGst = goldValue * (rates.gst / 100);
  
  // Calculate GST on making charges (18%)
  const makingChargesGst = makingCharges * (rates.makingChargesTax / 100);
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  if (isInterState) {
    // For inter-state transactions, use IGST
    igst = goldGst + makingChargesGst;
  } else {
    // For intra-state transactions, split into CGST and SGST
    cgst = (goldGst + makingChargesGst) / 2;
    sgst = (goldGst + makingChargesGst) / 2;
  }
  
  const totalGst = cgst + sgst + igst;
  const cess = subtotal * (rates.cess / 100);
  const totalTax = totalGst + cess;
  const grandTotal = subtotal + totalTax;
  
  return {
    subtotal,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    cess: Math.round(cess * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    taxableAmount: subtotal
  };
};

export const formatTaxAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Get tax summary for display
export const getTaxSummary = (taxBreakdown: TaxBreakdown, isInterState: boolean = false) => {
  const summary = [];
  
  if (!isInterState) {
    if (taxBreakdown.cgst > 0) {
      summary.push({ label: 'CGST (1.5%)', amount: taxBreakdown.cgst });
    }
    if (taxBreakdown.sgst > 0) {
      summary.push({ label: 'SGST (1.5%)', amount: taxBreakdown.sgst });
    }
  } else {
    if (taxBreakdown.igst > 0) {
      summary.push({ label: 'IGST (3%)', amount: taxBreakdown.igst });
    }
  }
  
  if (taxBreakdown.cess > 0) {
    summary.push({ label: 'Cess', amount: taxBreakdown.cess });
  }
  
  return summary;
};
