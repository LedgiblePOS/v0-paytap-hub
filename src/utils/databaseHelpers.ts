
/**
 * This file contains helper functions for common database operations
 */

/**
 * Helper function to convert JSON data with proper typing for verification data
 * @param data The verification data object
 * @returns The data formatted as a JSON string
 */
export const formatVerificationData = (data: Record<string, any>): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("Error formatting verification data:", error);
    return "{}";
  }
};

/**
 * Format Audit Log error documentation
 * Document common errors with Supabase and TypeScript that we encountered
 */
export const commonTypeErrors = {
  // Error: This happened because we tried to reference a child table with select
  // but the relationship wasn't properly defined
  relationError: "SelectQueryError<could not find the relation between tables>",
  
  // Error: This happened because we tried to use .count() but it wasn't properly typed
  countError: "Property 'count' does not exist on type 'PostgrestFilterBuilder'",
  
  // Error: This happened with wrong property access on objects
  propertyError: "Property 'id' does not exist on type...",
  
  // Error: This happened when we had mismatches between our TypeScript types and database schema
  schemaError: "Object literal may only specify known properties...",
  
  // How to fix: TypeScript types should match exactly the column names in the database
  fix: "Ensure TypeScript interfaces exactly match database column names"
};

/**
 * Documentation of common Supabase errors and their solutions
 */
export const supabaseErrorFixes = {
  // Error: We got errors with a string column when our TypeScript type expected enum values
  typeError: "Make sure TypeScript enum types match allowed values in the database",
  
  // Error: We tried to use .single() but got multiple rows or no rows
  singleError: "Use .maybeSingle() when you're not sure if a row exists",
  
  // Error: We tried to insert/update with a column that doesn't exist
  columnError: "Check database schema to confirm column names",
  
  // Error: Routes components aren't rendered as expected
  routeError: "React Router expects Route components as direct children of Routes",
  
  // Best practice for routing components
  routeBestPractice: "When creating components that render routes, always return Route components"
};

/**
 * Solutions for product_limit TypeScript error in subscription plans 
 */
export const subscriptionTypeFixExample = `
// Define interface matching database schema exactly:
interface SubscriptionPlan {
  id: string;
  name: string;
  product_limit: number; // This was missing in our database schema
  monthly_price: number;
  annual_price: number;
  features: string | null;
  is_active: boolean;
  created_at: string;
}

// When fetching data from the database, add the missing field:
const { data } = await supabase.from('subscription_plans').select('*');
const plans = data.map(plan => ({
  ...plan,
  product_limit: plan.product_limit || 10 // Add default value for missing field
}));
`;
