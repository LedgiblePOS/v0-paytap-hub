
import { supabase } from "@/integrations/supabase/client";
import { Customer, CustomerModel, Transaction, TransactionModel } from "@/types";
import { toCustomerEntity, toCustomerModel, toCustomerModels, toTransactionModels } from "@/utils/modelConversions";

// Get all customers for a merchant
export const getCustomers = async (merchantId?: string): Promise<CustomerModel[]> => {
  try {
    let query = supabase
      .from('customers')
      .select('*');
    
    if (merchantId) {
      query = query.eq('merchant_id', merchantId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Convert database entities to UI models
    return toCustomerModels(data as Customer[]);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Get a specific customer by ID
export const getCustomerById = async (id: string): Promise<CustomerModel | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw error;
    }
    
    // Convert database entity to UI model
    return toCustomerModel(data as Customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (
  customerData: Omit<CustomerModel, "id" | "createdAt" | "updatedAt">
): Promise<CustomerModel> => {
  try {
    // Convert UI model to database entity
    const customerEntity = toCustomerEntity({
      ...customerData,
      id: '',  // Placeholder, will be replaced by database
      createdAt: '',  // Placeholder
      updatedAt: ''   // Placeholder
    });
    
    const { data, error } = await supabase
      .from('customers')
      .insert(customerEntity)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert database entity to UI model
    return toCustomerModel(data as Customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Update an existing customer
export const updateCustomer = async (
  id: string,
  customerData: Partial<CustomerModel>
): Promise<CustomerModel> => {
  try {
    // Convert partial UI model to partial database entity
    const updateData: Partial<Customer> = {};
    
    if (customerData.merchantId !== undefined) updateData.merchant_id = customerData.merchantId;
    if (customerData.firstName !== undefined) updateData.first_name = customerData.firstName;
    if (customerData.lastName !== undefined) updateData.last_name = customerData.lastName;
    if (customerData.email !== undefined) updateData.email = customerData.email;
    if (customerData.phone !== undefined) updateData.phone = customerData.phone;
    
    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert database entity to UI model
    return toCustomerModel(data as Customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Get customer transactions
export const getCustomerTransactions = async (customerId: string): Promise<TransactionModel[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('customer_id', customerId);
      
    if (error) throw error;
    
    // Convert database entities to UI models
    return toTransactionModels(data as Transaction[]);
  } catch (error) {
    console.error('Error fetching customer transactions:', error);
    throw error;
  }
};
