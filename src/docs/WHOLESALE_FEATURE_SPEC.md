
# Wholesale Feature Specification

This document outlines the implementation approach for adding a wholesale discount feature to the Point of Sale (POS) module.

## Feature Overview

The wholesale feature will automatically apply discounts when customers purchase 3 or more of the same item, encouraging bulk purchases.

### Core Requirements

1. **Discount Trigger**
   - Apply discount automatically when 3+ of the same product are added to cart
   - No user action required to activate the discount
   - Discount appears as soon as quantity threshold is met

2. **Discount Calculation**
   - Base discount: 5% for 3-5 items
   - Medium discount: 10% for 6-10 items
   - Bulk discount: 15% for 11+ items
   - Apply discount to the specific items only, not the entire cart

3. **User Interface Updates**
   - Show discount amount per item in cart
   - Display total discount amount at checkout
   - Highlight discounted items visually
   - Show potential discounts for items near threshold

## Implementation Approach

### 1. Data Model Updates

```typescript
// Discount Rule Type
interface DiscountRule {
  minQuantity: number;
  discountPercentage: number;
}

// Default wholesale discount rules
const defaultWholesaleRules: DiscountRule[] = [
  { minQuantity: 3, discountPercentage: 5 },
  { minQuantity: 6, discountPercentage: 10 },
  { minQuantity: 11, discountPercentage: 15 }
];

// Cart Item with discount
interface CartItemWithDiscount extends CartItemType {
  discountPercentage?: number;
  originalPrice: number;
  discountedPrice?: number;
}
```

### 2. Business Logic Implementation

The discount logic will be implemented in a separate utility file to keep the code clean and testable.

```typescript
// Calculate discount for a specific cart item
function calculateItemDiscount(item: CartItemType, rules: DiscountRule[]): CartItemWithDiscount {
  // Find applicable discount rule based on quantity
  const applicableRule = rules
    .slice()
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find(rule => item.quantity >= rule.minQuantity);
  
  // Apply discount if a rule matches
  if (applicableRule) {
    const discountPercentage = applicableRule.discountPercentage;
    const originalPrice = item.price;
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);
    
    return {
      ...item,
      discountPercentage,
      originalPrice,
      discountedPrice
    };
  }
  
  // No discount applicable
  return {
    ...item,
    originalPrice: item.price
  };
}

// Calculate discounts for all cart items
function applyWholesaleDiscounts(
  items: CartItemType[], 
  rules: DiscountRule[] = defaultWholesaleRules
): CartItemWithDiscount[] {
  return items.map(item => calculateItemDiscount(item, rules));
}
```

### 3. UI Component Updates

#### Cart Component
- Update to show original and discounted prices
- Add visual indicator for discounted items
- Display potential discount for items near threshold

#### Checkout Component
- Show discount summary section
- Display total savings amount
- Include discount details in receipt

### 4. Settings Configuration

Add a Wholesale Configuration screen in admin settings to:
- Enable/disable wholesale discounts
- Configure discount thresholds and percentages
- Set product-specific discount rules
- View discount analytics

## Implementation Plan

### Phase 1: Core Functionality
1. Implement discount calculation logic
2. Update Cart component to display discounts
3. Modify Checkout process to include discounts
4. Store discount information with orders

### Phase 2: Configuration
1. Create wholesale settings UI
2. Implement rules management
3. Add product-specific discount rules
4. Create discount reports

### Phase 3: Advanced Features
1. Add time-limited discount campaigns
2. Implement customer-specific discount rules
3. Create bulk discount promotions
4. Add advanced analytics for discount effectiveness

## Testing Strategy

1. **Unit Tests**
   - Test discount calculation with various quantities
   - Verify threshold behavior at boundary conditions
   - Test with custom discount rules

2. **Integration Tests**
   - Verify cart updates with discounts
   - Test checkout process with discounted items
   - Validate order creation with discount data

3. **User Acceptance Tests**
   - Complete POS workflows with discounts
   - Verify discount display and calculations
   - Test edge cases (changing quantities, removing items)

By implementing this wholesale feature, we will enhance the POS functionality to support bulk purchases while maintaining the integrity of the existing code base.
