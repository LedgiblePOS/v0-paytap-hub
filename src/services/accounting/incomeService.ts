
import { supabase } from "@/integrations/supabase/client";
import { Income, IncomeModel } from "@/types/accounting";
import { 
  toIncomeModel, 
  toIncomeEntity, 
  toIncomeModels 
} from "@/utils/modelConversions/accountingConverters";

// Type definition to help with casting
type DbIncome = {
  id: string;
  merchant_id: string;
  amount: number;
  description: string;
  source: string;
  date: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
};

/**
 * Fetch all income records for a merchant
 */
export const getIncomes = async (merchantId: string): Promise<IncomeModel[]> => {
  try {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('date', { ascending: false }) as { data: DbIncome[] | null, error: any };
    
    if (error) throw error;
    
    // Handle null data case and perform type conversion
    return data ? toIncomeModels(data as unknown as Income[]) : [];
  } catch (error) {
    console.error('Error fetching incomes:', error);
    throw error;
  }
};

/**
 * Create a new income record
 */
export const createIncome = async (income: IncomeModel): Promise<IncomeModel> => {
  try {
    const entity = toIncomeEntity(income);
    
    const { data, error } = await supabase
      .from('incomes')
      .insert(entity)
      .select()
      .single() as { data: DbIncome | null, error: any };
    
    if (error) throw error;
    if (!data) throw new Error("Failed to create income: No data returned");
    
    return toIncomeModel(data as unknown as Income);
  } catch (error) {
    console.error('Error creating income:', error);
    throw error;
  }
};

/**
 * Update an existing income record
 */
export const updateIncome = async (id: string, updates: Partial<IncomeModel>): Promise<void> => {
  try {
    // Convert partial model updates to entity format
    const entityUpdates: Partial<Income> = {};
    if ('amount' in updates) entityUpdates.amount = updates.amount;
    if ('description' in updates) entityUpdates.description = updates.description;
    if ('date' in updates) entityUpdates.date = updates.date;
    if ('source' in updates) entityUpdates.source = updates.source;
    if ('documentUrl' in updates) entityUpdates.document_url = updates.documentUrl;
    
    const { error } = await supabase
      .from('incomes')
      .update(entityUpdates)
      .eq('id', id) as { error: any };
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating income:', error);
    throw error;
  }
};

/**
 * Delete an income record
 */
export const deleteIncome = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', id) as { error: any };
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting income:', error);
    throw error;
  }
};
