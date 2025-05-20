
import { supabase } from '@/lib/supabase';

/**
 * Verify that all required database tables exist
 * This helps ensure migrations have been properly applied
 */
export const verifyRequiredTables = async (): Promise<{
  success: boolean;
  missingTables: string[];
  message: string;
}> => {
  const requiredTables = [
    'inventory_items',
    'merchants',
    'products',
    'transactions',
    'customers',
    'categories',
    'audit_logs'
    // Add more tables as needed
  ];
  
  try {
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (error) {
      throw new Error(`Failed to check tables: ${error.message}`);
    }
    
    const existingTables = (data || []).map(row => row.tablename);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    return {
      success: missingTables.length === 0,
      missingTables,
      message: missingTables.length === 0
        ? 'All required tables exist in the database'
        : `Missing tables: ${missingTables.join(', ')}`
    };
  } catch (error) {
    console.error('Table verification failed:', error);
    return {
      success: false,
      missingTables: [],
      message: `Failed to verify tables: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Check if any pending migrations need to be applied
 * Compares the current database state with the expected schema
 */
export const checkPendingMigrations = async (): Promise<{
  hasPendingMigrations: boolean;
  pendingMigrations: string[];
  message: string;
}> => {
  // This is a placeholder. In a real implementation, this would compare
  // the actual database schema with the expected schema based on migration files
  
  try {
    // Example implementation that simply checks for specific columns
    // that should exist in the latest migration
    const { data: inventoryColumns, error: inventoryError } = await supabase
      .rpc('get_table_columns', { table_name: 'inventory_items' });
    
    if (inventoryError) {
      throw new Error(`Failed to check columns: ${inventoryError.message}`);
    }
    
    const columnNames = (inventoryColumns || []).map((col: any) => col.column_name);
    const requiredColumns = ['id', 'merchant_id', 'name', 'quantity', 'reorder_point', 'category'];
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    return {
      hasPendingMigrations: missingColumns.length > 0,
      pendingMigrations: missingColumns.length > 0 ? ['add_missing_columns_to_inventory_items'] : [],
      message: missingColumns.length > 0
        ? `Missing columns in inventory_items: ${missingColumns.join(', ')}`
        : 'No pending migrations detected'
    };
  } catch (error) {
    console.error('Migration check failed:', error);
    return {
      hasPendingMigrations: false,
      pendingMigrations: [],
      message: `Failed to check migrations: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Verify environment variables required for database connection
 */
export const verifyDatabaseEnvVariables = (): {
  success: boolean;
  missingVars: string[];
  message: string;
} => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );
  
  return {
    success: missingVars.length === 0,
    missingVars,
    message: missingVars.length === 0
      ? 'All database environment variables are set'
      : `Missing database environment variables: ${missingVars.join(', ')}`
  };
};

/**
 * Comprehensive database validation for production readiness
 */
export const validateDatabaseForProduction = async (): Promise<{
  ready: boolean;
  checks: Record<string, any>;
}> => {
  const checks: Record<string, any> = {};
  
  // 1. Check environment variables
  checks.envVariables = verifyDatabaseEnvVariables();
  
  // 2. Check required tables
  checks.requiredTables = await verifyRequiredTables();
  
  // 3. Check pending migrations
  checks.pendingMigrations = await checkPendingMigrations();
  
  // Determine overall readiness
  const isReady = Object.values(checks).every(
    (check: any) => check.success !== false
  );
  
  return {
    ready: isReady,
    checks
  };
};

export default {
  verifyRequiredTables,
  checkPendingMigrations,
  verifyDatabaseEnvVariables,
  validateDatabaseForProduction
};
