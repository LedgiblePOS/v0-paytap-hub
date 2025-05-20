
# Point of Sale (POS) Module Implementation Guide

This document outlines the implementation approach and best practices for the Point of Sale module, incorporating lessons learned from the Inventory module implementation.

## Architecture Overview

The POS module is organized with the following component hierarchy:

1. **POS.tsx**: The main container component that manages tabs, cart state, and overall flow
2. **ProductSelection.tsx**: Handles displaying and selecting products to add to cart
3. **Cart.tsx**: Manages the shopping cart contents and interactions
4. **Checkout.tsx**: Payment method selection and processing
5. **CustomerSelection.tsx**: For selecting and managing customer information

## Implementation Best Practices

### Path Resolution

After experiencing issues with the Inventory module, we've established these practices:

- Use absolute imports with `@/` prefix (e.g., `import { Button } from '@/components/ui/button'`)
- Group related components in dedicated directories (e.g., `/components/POS/`)
- Test imports thoroughly before committing changes

### Component Structure

- Keep components small and focused on a single responsibility
- Use React hooks for state management and business logic
- Maintain clear props interfaces for all components
- Implement loading states and error handling consistently

### Error Prevention

- Add data attributes to components for testing (e.g., `data-testid="pos-module"`)
- Add debug logging for component lifecycle events
- Handle edge cases like empty cart states
- Gracefully handle payment processing errors

### Payment Integration

The POS module integrates with multiple payment methods:

1. **Card Payments**: Standard credit/debit card processing
2. **Cash Payments**: Record cash transactions and generate receipts
3. **Tap to Pay**: Integration with Fasstap API for contactless payments
4. **CBDC (Future)**: Support for central bank digital currency payments

Each payment method is implemented as a separate flow within the Checkout component.

## Wholesale Discount Feature

The wholesale discount feature enables different pricing for wholesale versus retail customers:

### Implementation Details

1. **Customer Selection**:
   - Added a customer selection tab to the POS flow
   - Customers can be classified as retail or wholesale
   - Customer type determines discount eligibility

2. **Discount Application**:
   - Automatic application of discounts for wholesale customers
   - Manual discount application through percentage or fixed amount options
   - Item-level and order-level discount support

3. **Visual Indicators**:
   - Original prices shown with strikethrough for discounted items
   - Discount breakdown in cart and checkout summaries
   - Special badges for wholesale customers

4. **Discount Utils**:
   - Centralized utility functions for discount calculations
   - Support for percentage-based and fixed amount discounts
   - Minimum quantity thresholds for discounts
   - Customer type specificity (wholesale vs retail)

## State Management

The POS module uses React's useState hook to manage:

- Cart items and quantities
- Active tab selection
- Selected payment method
- Payment processing state
- Customer selection
- Discount configuration

For more complex state needs, consider migrating to useReducer or a dedicated state management library.

## Testing Checklist

Before deploying POS changes:

1. Verify navigation to and from the POS route
2. Test product selection and cart functionality
3. Verify all payment methods work as expected
4. Test error conditions (network errors, payment failures)
5. Check responsive design on various screen sizes
6. Validate discount calculations for different scenarios
7. Test customer type switching and discount application

## Future Enhancements

- Customer lookup and association with sales
- Barcode scanner integration
- Receipt printing
- Split payment functionality
- Inventory reduction on successful sale
- Bulk discount features for volume purchases
- Loyalty program integration

## Common Issues and Solutions

### White Screen Prevention

Similar to the inventory module, we've added:
- Explicit testid attributes
- Debug logging
- Progressive loading states
- Error boundaries

### Payment Processing Errors

Potential issues:
- API connectivity problems
- Missing credentials
- Invalid payment details

Solutions:
- Implement comprehensive error handling
- Add clear user feedback for payment issues
- Log detailed error information for debugging

By following these guidelines, we can create a robust POS module that avoids the issues encountered during the Inventory implementation.

