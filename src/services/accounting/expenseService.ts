
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseModel, Receipt, ReceiptModel } from "@/types/accounting";
import { 
  toExpenseModel, 
  toExpenseEntity, 
  toExpenseModels,
  toReceiptModel
} from "@/utils/modelConversions/accountingConverters";

// Type definitions to help with type casting
type DbExpense = {
  id: string;
  merchant_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt_image_url?: string;
  tax_deductible: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Fetch all expenses for a merchant
 */
export const getExpenses = async (merchantId: string): Promise<ExpenseModel[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('date', { ascending: false }) as { data: DbExpense[] | null, error: any };
    
    if (error) throw error;
    
    // Cast the result to the correct type and handle null data
    return data ? toExpenseModels(data as unknown as Expense[]) : [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

/**
 * Create a new expense record
 */
export const createExpense = async (expense: ExpenseModel): Promise<ExpenseModel> => {
  try {
    const entity = toExpenseEntity(expense);
    
    const { data, error } = await supabase
      .from('expenses')
      .insert(entity)
      .select()
      .single() as { data: DbExpense | null, error: any };
    
    if (error) throw error;
    if (!data) throw new Error("Failed to create expense: No data returned");
    
    // Cast the result to the correct type
    return toExpenseModel(data as unknown as Expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

/**
 * Update an existing expense
 */
export const updateExpense = async (id: string, updates: Partial<ExpenseModel>): Promise<void> => {
  try {
    // Convert partial model updates to entity format
    const entityUpdates: Partial<Expense> = {};
    if ('amount' in updates) entityUpdates.amount = updates.amount;
    if ('description' in updates) entityUpdates.description = updates.description;
    if ('date' in updates) entityUpdates.date = updates.date;
    if ('category' in updates) entityUpdates.category = updates.category;
    if ('receiptImageUrl' in updates) entityUpdates.receipt_image_url = updates.receiptImageUrl;
    if ('taxDeductible' in updates) entityUpdates.tax_deductible = updates.taxDeductible;
    
    const { error } = await supabase
      .from('expenses')
      .update(entityUpdates)
      .eq('id', id) as { error: any };
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

/**
 * Delete an expense
 */
export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id) as { error: any };
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

/**
 * Upload a receipt image and attach it to an expense
 */
export const uploadReceiptImage = async (
  expenseId: string,
  file: File
): Promise<string> => {
  try {
    const fileName = `${expenseId}_${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;
    
    // Update the expense with the receipt URL
    await updateExpense(expenseId, { receiptImageUrl: publicUrl });
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading receipt:', error);
    throw error;
  }
};

/**
 * Process and extract data from a receipt image using AI
 */
export const processReceiptImage = async (
  imageBase64: string
): Promise<any> => {
  try {
    // This would connect to an AI service to process the receipt
    // For now, we'll return a mock response
    return {
      vendor: "Office Supplies Co",
      date: new Date().toISOString().split('T')[0],
      total: 125.40,
      items: [
        { description: "Printer Paper", amount: 45.99 },
        { description: "Ink Cartridges", amount: 79.41 }
      ],
      taxAmount: 10.45
    };
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw error;
  }
};
