
import { supabase } from '@/integrations/supabase/client';

/**
 * Verify database health by testing connection and basic operations
 * @returns Object with success status and details
 */
export const verifyDatabaseHealth = async (): Promise<{
  success: boolean;
  details: Record<string, any>;
}> => {
  const details: Record<string, any> = {};
  
  try {
    // 1. Test basic connection - check server time
    const { data: serverTime, error: timeError } = await supabase
      .rpc('now');
      
    if (timeError) {
      details.connection = {
        success: false,
        message: `Database connection error: ${timeError.message}`
      };
      return { success: false, details };
    }
    
    details.connection = {
      success: true,
      serverTime
    };
    
    // 2. Check if essential tables exist
    try {
      const tables = ['profiles', 'merchants', 'products', 'expenses', 'incomes'];
      const tableResults: Record<string, boolean> = {};
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
          
        tableResults[table] = !error;
      }
      
      details.tables = {
        success: Object.values(tableResults).every(v => v),
        results: tableResults
      };
    } catch (error) {
      details.tables = {
        success: false,
        message: `Error checking tables: ${(error as Error).message}`
      };
    }
    
    // 3. Check if RLS policies are working
    try {
      // This will pass if RLS is working correctly for the current user
      const { data: rlsTest, error: rlsError } = await supabase
        .from('merchants')
        .select('id')
        .limit(1);
        
      details.rls = {
        success: !rlsError,
        message: rlsError ? `RLS check failed: ${rlsError.message}` : 'RLS policies appear to be working'
      };
    } catch (error) {
      details.rls = {
        success: false,
        message: `Error testing RLS: ${(error as Error).message}`
      };
    }
    
    const allChecksSuccessful = Object.values(details).every(
      (detail: any) => detail.success
    );
    
    return {
      success: allChecksSuccessful,
      details
    };
  } catch (error) {
    console.error("Database health check failed:", error);
    return {
      success: false,
      details: {
        error: `Unexpected error during health check: ${(error as Error).message}`
      }
    };
  }
};

/**
 * Test all critical application paths
 * @returns Object with test results
 */
export const runApplicationTests = async (): Promise<{
  success: boolean;
  results: Record<string, any>;
}> => {
  const results: Record<string, any> = {};
  
  // 1. Check database health
  results.database = await verifyDatabaseHealth();
  
  // 2. Check authentication flow
  try {
    const { data: session } = await supabase.auth.getSession();
    results.auth = {
      success: true,
      hasSession: !!session.session,
      message: session.session 
        ? 'Authentication session detected' 
        : 'No authentication session'
    };
  } catch (error) {
    results.auth = {
      success: false,
      message: `Auth check error: ${(error as Error).message}`
    };
  }
  
  const allTestsSuccessful = Object.values(results).every(
    (result: any) => result.success
  );
  
  return {
    success: allTestsSuccessful,
    results
  };
};

export default {
  verifyDatabaseHealth,
  runApplicationTests
};
