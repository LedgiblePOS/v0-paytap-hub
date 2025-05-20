
import { supabase } from '@/integrations/supabase/client';

// Simplified supplier interface
interface Supplier {
  id: string;
  name: string;
  merchant_id: string;
}

/**
 * Get suppliers for the current merchant
 */
export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    // Get suppliers from the database
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Return mock data for development
      return getMockSuppliers();
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    // Return mock data as fallback
    return getMockSuppliers();
  }
};

/**
 * Generate mock supplier data for development
 */
const getMockSuppliers = (): Supplier[] => {
  return [
    { id: 'supp1', name: 'ABC Supplies', merchant_id: 'mock' },
    { id: 'supp2', name: 'XYZ Distribution', merchant_id: 'mock' },
    { id: 'supp3', name: 'Global Imports', merchant_id: 'mock' }
  ];
};
