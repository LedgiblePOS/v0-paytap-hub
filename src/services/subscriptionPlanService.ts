
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlanModel } from "@/types";
import { toSubscriptionPlanModel } from "@/utils/modelConversions/subscriptionConverters";

/**
 * Service for managing subscription plans in the Super Admin panel
 */
class SubscriptionPlanService {
  /**
   * Get all subscription plans
   */
  public async getAllSubscriptionPlans(includeInactive = false): Promise<SubscriptionPlanModel[]> {
    try {
      let query = supabase
        .from('subscription_plans')
        .select('*')
        .order('monthly_price', { ascending: true });
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;
      }
      
      return data.map(plan => toSubscriptionPlanModel(plan));
    } catch (error) {
      console.error("Error in getAllSubscriptionPlans:", error);
      throw error;
    }
  }
  
  /**
   * Create a new subscription plan
   */
  public async createSubscriptionPlan(plan: Omit<SubscriptionPlanModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlanModel> {
    try {
      const planData = {
        name: plan.name,
        description: plan.description || '',
        monthly_price: plan.monthlyPrice,
        annual_price: plan.annualPrice,
        product_limit: plan.productLimit,
        features: Array.isArray(plan.features) ? JSON.stringify(plan.features) : plan.features,
        is_active: plan.isActive
      };
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert(planData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating subscription plan:", error);
        throw error;
      }
      
      return toSubscriptionPlanModel(data);
    } catch (error) {
      console.error("Error in createSubscriptionPlan:", error);
      throw error;
    }
  }
  
  /**
   * Update an existing subscription plan
   */
  public async updateSubscriptionPlan(id: string, plan: Partial<Omit<SubscriptionPlanModel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SubscriptionPlanModel> {
    try {
      const updateData: any = {};
      
      if (plan.name !== undefined) updateData.name = plan.name;
      if (plan.description !== undefined) updateData.description = plan.description;
      if (plan.monthlyPrice !== undefined) updateData.monthly_price = plan.monthlyPrice;
      if (plan.annualPrice !== undefined) updateData.annual_price = plan.annualPrice;
      if (plan.productLimit !== undefined) updateData.product_limit = plan.productLimit;
      if (plan.features !== undefined) {
        updateData.features = Array.isArray(plan.features) ? JSON.stringify(plan.features) : plan.features;
      }
      if (plan.isActive !== undefined) updateData.is_active = plan.isActive;
      if (plan.transactionFeePercentage !== undefined) updateData.transaction_fee_percentage = plan.transactionFeePercentage;
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating subscription plan:", error);
        throw error;
      }
      
      return toSubscriptionPlanModel(data);
    } catch (error) {
      console.error("Error in updateSubscriptionPlan:", error);
      throw error;
    }
  }
  
  /**
   * Delete a subscription plan
   */
  public async deleteSubscriptionPlan(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting subscription plan:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in deleteSubscriptionPlan:", error);
      throw error;
    }
  }
  
  /**
   * Get a subscription plan by ID
   */
  public async getSubscriptionPlanById(id: string): Promise<SubscriptionPlanModel | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          return null;
        }
        console.error("Error fetching subscription plan:", error);
        throw error;
      }
      
      return toSubscriptionPlanModel(data);
    } catch (error) {
      console.error("Error in getSubscriptionPlanById:", error);
      throw error;
    }
  }
}

export default new SubscriptionPlanService();
