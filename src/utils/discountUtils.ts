
export interface DiscountConfig {
  percentageDiscount?: number;
  fixedDiscount?: number;
  isPercentage?: boolean;
  minPurchase?: number;
  maxDiscount?: number;
  discountCode?: string;
  isActive?: boolean;
  // Add these properties for backward compatibility
  type?: 'percentage' | 'fixed' | 'none';
  value?: number;
}

export const calculateDiscount = (
  originalPrice: number,
  quantity: number,
  config: DiscountConfig
): number => {
  if (!config || !config.isActive) {
    return originalPrice * quantity;
  }

  const totalPrice = originalPrice * quantity;
  
  // Check if minimum purchase requirement is met
  if (config.minPurchase && totalPrice < config.minPurchase) {
    return totalPrice;
  }

  let discountAmount = 0;
  
  if (config.isPercentage && config.percentageDiscount) {
    discountAmount = totalPrice * (config.percentageDiscount / 100);
  } else if (config.fixedDiscount) {
    discountAmount = config.fixedDiscount;
  }
  
  // Apply maximum discount cap if specified
  if (config.maxDiscount && discountAmount > config.maxDiscount) {
    discountAmount = config.maxDiscount;
  }
  
  return Math.max(0, totalPrice - discountAmount);
};
