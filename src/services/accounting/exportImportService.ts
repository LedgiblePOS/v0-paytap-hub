
import { supabase } from "@/integrations/supabase/client";
import { saveAs } from "file-saver";
import { ExpenseModel, IncomeModel } from "@/types/accounting";
import { toExpenseModels, toIncomeModels } from "@/utils/modelConversions/accountingConverters";
import * as XLSX from 'xlsx';

/**
 * Export expenses and income data to Excel
 */
export const exportAccountingData = async (
  merchantId: string,
  startDate?: string,
  endDate?: string
): Promise<Blob> => {
  try {
    // Fetch expenses data
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('date', { ascending: false });
    
    if (expensesError) throw expensesError;
    
    // Fetch income data
    const { data: incomesData, error: incomesError } = await supabase
      .from('incomes')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('date', { ascending: false });
    
    if (incomesError) throw incomesError;
    
    // Convert to models
    const expenses = toExpenseModels(expensesData || []);
    const incomes = toIncomeModels(incomesData || []);
    
    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();
    
    // Format expenses for Excel
    const expensesFormatted = expenses.map(expense => ({
      Date: expense.date,
      Description: expense.description,
      Amount: expense.amount,
      Category: expense.category,
      'Tax Deductible': expense.taxDeductible ? 'Yes' : 'No',
      'Receipt URL': expense.receiptImageUrl || ''
    }));
    
    // Format incomes for Excel
    const incomesFormatted = incomes.map(income => ({
      Date: income.date,
      Description: income.description,
      Amount: income.amount,
      Source: income.source,
      'Document URL': income.documentUrl || ''
    }));
    
    // Add worksheets
    const wsExpenses = XLSX.utils.json_to_sheet(expensesFormatted);
    const wsIncomes = XLSX.utils.json_to_sheet(incomesFormatted);
    
    XLSX.utils.book_append_sheet(wb, wsExpenses, "Expenses");
    XLSX.utils.book_append_sheet(wb, wsIncomes, "Income");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  } catch (error) {
    console.error('Error exporting accounting data:', error);
    throw error;
  }
};

/**
 * Import expenses and income data from Excel
 */
export const importAccountingData = async (
  merchantId: string,
  file: File
): Promise<{ importedExpenses: number, importedIncomes: number }> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const wb = XLSX.read(data, { type: 'array' });
          
          let importedExpenses = 0;
          let importedIncomes = 0;
          
          // Process expenses if sheet exists
          const expensesSheetName = wb.SheetNames.find(name => name.toLowerCase().includes('expense'));
          if (expensesSheetName) {
            const expensesSheet = wb.Sheets[expensesSheetName];
            const expenses = XLSX.utils.sheet_to_json(expensesSheet);
            
            // Import expenses
            for (const row of expenses) {
              const expense = {
                merchant_id: merchantId,
                amount: Number(row.Amount || 0),
                description: String(row.Description || ''),
                category: String(row.Category || 'Other'),
                date: String(row.Date || new Date().toISOString().split('T')[0]),
                tax_deductible: String(row['Tax Deductible'] || '').toLowerCase() === 'yes',
                receipt_image_url: String(row['Receipt URL'] || '')
              };
              
              const { error } = await supabase.from('expenses').insert(expense);
              if (!error) importedExpenses++;
            }
          }
          
          // Process incomes if sheet exists
          const incomesSheetName = wb.SheetNames.find(name => name.toLowerCase().includes('income'));
          if (incomesSheetName) {
            const incomesSheet = wb.Sheets[incomesSheetName];
            const incomes = XLSX.utils.sheet_to_json(incomesSheet);
            
            // Import incomes
            for (const row of incomes) {
              const income = {
                merchant_id: merchantId,
                amount: Number(row.Amount || 0),
                description: String(row.Description || ''),
                source: String(row.Source || 'Sales'),
                date: String(row.Date || new Date().toISOString().split('T')[0]),
                document_url: String(row['Document URL'] || '')
              };
              
              const { error } = await supabase.from('incomes').insert(income);
              if (!error) importedIncomes++;
            }
          }
          
          resolve({ importedExpenses, importedIncomes });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error('Error importing accounting data:', error);
    throw error;
  }
};
