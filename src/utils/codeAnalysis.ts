
/**
 * Code Analysis Utility
 * 
 * This utility provides functions to analyze code for common TypeScript errors and provides
 * fixes for them. This is a development-only tool.
 */

// Function to detect camelCase/snake_case mismatch in property access
function detectPropertyMismatch(code: string): { errors: string[], fixes: { original: string, fixed: string }[] } {
  const errors: string[] = [];
  const fixes: { original: string, fixed: string }[] = [];
  
  // Common snake_case to camelCase property pairs
  const propertyPairs = [
    { snake: 'first_name', camel: 'firstName' },
    { snake: 'last_name', camel: 'lastName' },
    { snake: 'created_at', camel: 'createdAt' },
    { snake: 'updated_at', camel: 'updatedAt' },
    { snake: 'payment_method', camel: 'paymentMethod' },
    { snake: 'merchant_id', camel: 'merchantId' },
    { snake: 'business_name', camel: 'businessName' },
    { snake: 'business_logo', camel: 'businessLogo' },
    { snake: 'product_limit', camel: 'productLimit' },
    { snake: 'product_count', camel: 'productCount' },
    { snake: 'default_currency', camel: 'defaultCurrency' },
    { snake: 'subscription_tier', camel: 'subscriptionTier' },
    { snake: 'image_url', camel: 'imageUrl' },
    { snake: 'category_id', camel: 'categoryId' },
    { snake: 'in_stock', camel: 'inStock' },
    { snake: 'customer_id', camel: 'customerId' },
    { snake: 'user_id', camel: 'userId' },
  ];
  
  // Regex for accessing entity properties in camelCase when they should be snake_case
  // e.g., merchant.businessName when it should be merchant.business_name
  for (const pair of propertyPairs) {
    // Find instances of entity.camelCase property access
    const camelAccessRegex = new RegExp(`\\.${pair.camel}\\b`, 'g');
    const matches = code.match(camelAccessRegex);
    
    if (matches) {
      for (const match of matches) {
        errors.push(`Property access ${match} may be incorrect if used with entity type. Should be .${pair.snake} for database entities.`);
        fixes.push({
          original: match,
          fixed: `.${pair.snake}`
        });
      }
    }
    
    // Find instances of constructing entities with camelCase properties
    const camelObjConstRegex = new RegExp(`(\\{[^}]*?)${pair.camel}\\s*:`, 'g');
    const objMatches = code.match(camelObjConstRegex);
    
    if (objMatches) {
      for (const match of objMatches) {
        const contextBefore = match.substring(0, match.length - pair.camel.length - 1);
        errors.push(`Object construction with ${pair.camel} may be incorrect if creating an entity. Should be ${pair.snake}.`);
        fixes.push({
          original: `${contextBefore}${pair.camel}:`,
          fixed: `${contextBefore}${pair.snake}:`
        });
      }
    }
  }
  
  return { errors, fixes };
}

// Function to suggest using appropriate model converters
function suggestModelConverters(code: string): { suggestions: string[] } {
  const suggestions: string[] = [];
  
  // Add suggestion if code seems to manually convert between entity and model formats
  const manualConversionPatterns = [
    { regex: /customer\.first_name/g, suggestion: "Consider using toCustomerModel to convert Customer to CustomerModel" },
    { regex: /merchant\.business_name/g, suggestion: "Consider using toMerchantModel to convert Merchant to MerchantModel" },
    { regex: /product\.in_stock/g, suggestion: "Consider using toProductModel to convert Product to ProductModel" },
    { regex: /transaction\.payment_method/g, suggestion: "Consider using toTransactionModel to convert Transaction to TransactionModel" },
  ];
  
  for (const pattern of manualConversionPatterns) {
    if (pattern.regex.test(code)) {
      suggestions.push(pattern.suggestion);
    }
  }
  
  // Look for cases where we should be wrapping component props
  if (/interface.*Props/.test(code) && /customer:.*Customer/.test(code)) {
    suggestions.push("Consider using CustomerModel instead of Customer type for component props");
  }
  
  if (/interface.*Props/.test(code) && /merchant:.*Merchant/.test(code)) {
    suggestions.push("Consider using MerchantModel instead of Merchant type for component props");
  }
  
  return { suggestions };
}

// Analysis function that can be called from development tools
export function analyzeCode(code: string) {
  const propertyMismatches = detectPropertyMismatch(code);
  const converterSuggestions = suggestModelConverters(code);
  
  return {
    ...propertyMismatches,
    ...converterSuggestions
  };
}

// Helper function to fix common errors in code
export function autoFixCode(code: string): string {
  const { fixes } = detectPropertyMismatch(code);
  
  let fixedCode = code;
  for (const fix of fixes) {
    fixedCode = fixedCode.replace(fix.original, fix.fixed);
  }
  
  // Add imports if they seem to be needed
  if ((/Customer/g.test(code) || /Transaction/g.test(code)) && 
      !/import.*modelConversions/.test(code)) {
    fixedCode = `import { toCustomerModel, toTransactionModel } from '@/utils/modelConversions';\n${fixedCode}`;
  }
  
  return fixedCode;
}
