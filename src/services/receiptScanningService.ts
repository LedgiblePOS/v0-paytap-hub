
/**
 * Service for handling receipt scanning and OCR operations
 */

interface ExtractedReceiptData {
  vendor?: string;
  date?: string;
  total?: number;
  items?: Array<{
    description: string;
    amount: number;
    quantity?: number;
  }>;
  taxAmount?: number;
  currency?: string;
}

/**
 * Process a receipt image using OCR to extract structured data
 * This is a placeholder that would connect to an AI service in production
 */
export const scanReceipt = async (imageFile: File): Promise<ExtractedReceiptData> => {
  try {
    console.log("Processing receipt image:", imageFile.name);
    
    // In a real implementation, we would upload the image to an OCR service
    // For now, we'll simulate a processing delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock receipt data
    const mockData: ExtractedReceiptData = {
      vendor: "Office Depot",
      date: new Date().toISOString().split('T')[0],
      total: 127.45,
      items: [
        { description: "Printer Paper A4", amount: 24.99, quantity: 2 },
        { description: "Stapler", amount: 12.99, quantity: 1 },
        { description: "Ink Cartridge HP301", amount: 59.99, quantity: 1 },
        { description: "Pens (Pack of 10)", amount: 8.99, quantity: 1 }
      ],
      taxAmount: 10.62,
      currency: "USD"
    };
    
    return mockData;
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to process receipt: " + (error as Error).message);
  }
};

/**
 * Verify a receipt's authenticity
 * This is a placeholder for a more sophisticated verification system
 */
export const verifyReceipt = async (receiptData: ExtractedReceiptData): Promise<boolean> => {
  try {
    // In a real implementation, this would check for signs of fraud or manipulation
    // For now, we'll do a simple validation
    if (!receiptData.total || !receiptData.date || !receiptData.items || receiptData.items.length === 0) {
      return false;
    }
    
    // Check if the items add up to the total (roughly)
    const calculatedTotal = receiptData.items.reduce((sum, item) => sum + item.amount, 0);
    const withTax = receiptData.taxAmount ? calculatedTotal + receiptData.taxAmount : calculatedTotal;
    
    // Allow for a small margin of error (OCR isn't perfect)
    const isValid = Math.abs(withTax - receiptData.total) < 1;
    
    return isValid;
  } catch (error) {
    console.error("Error verifying receipt:", error);
    return false;
  }
};

/**
 * Categorize a receipt based on vendor and items
 * This would use machine learning in a real implementation
 */
export const categorizeReceipt = async (receiptData: ExtractedReceiptData): Promise<string> => {
  // Mock categorization logic
  const vendorLower = receiptData.vendor?.toLowerCase() || '';
  const itemDescriptions = receiptData.items?.map(item => item.description.toLowerCase()) || [];
  
  // Check for office supplies
  if (
    vendorLower.includes('office') || 
    vendorLower.includes('staples') ||
    itemDescriptions.some(desc => 
      desc.includes('paper') || 
      desc.includes('ink') || 
      desc.includes('printer') ||
      desc.includes('pen')
    )
  ) {
    return 'Office Supplies';
  }
  
  // Check for travel
  if (
    vendorLower.includes('airline') || 
    vendorLower.includes('hotel') ||
    vendorLower.includes('motel') ||
    vendorLower.includes('taxi') ||
    vendorLower.includes('uber') ||
    itemDescriptions.some(desc => 
      desc.includes('flight') || 
      desc.includes('ticket') || 
      desc.includes('room') ||
      desc.includes('travel')
    )
  ) {
    return 'Travel';
  }
  
  // Check for meals
  if (
    vendorLower.includes('restaurant') || 
    vendorLower.includes('cafe') ||
    vendorLower.includes('diner') ||
    itemDescriptions.some(desc => 
      desc.includes('meal') || 
      desc.includes('lunch') || 
      desc.includes('dinner') ||
      desc.includes('breakfast')
    )
  ) {
    return 'Meals & Entertainment';
  }
  
  // Fallback category
  return 'Miscellaneous';
};
