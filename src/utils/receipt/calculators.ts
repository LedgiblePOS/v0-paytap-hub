
/**
 * Calculate tax amount based on total and tax rate
 */
export const calculateTaxAmount = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

/**
 * Calculate change amount for cash transactions
 */
export const calculateChange = (total: number, cashGiven: number): number => {
  return Math.max(0, cashGiven - total);
};
