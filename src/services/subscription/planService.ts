
import { supabase } from '@/integrations/supabase/client';
import { CreateSubscriptionPlanInput, UpdateSubscriptionPlanInput, SubscriptionPlanModel } from './types';

class SubscriptionPlanService {
  public async getSubscriptionPlans(includeInactive: boolean = false): Promise<SubscriptionPlanModel[]> {
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
        console.error("Error getting subscription plans:", error);
        return [];
      }
      
      return data.map(plan => ({
        id: plan.id,
        name: plan.name,
        monthlyPrice: Number(plan.monthly_price),
        annualPrice: Number(plan.annual_price),
        features: plan.features || [],
        isActive: plan.is_active,
        productLimit: plan.product_limit,
        transactionFeePercentage: Number(plan.transaction_fee_percentage),
        createdAt: plan.created_at,
        updatedAt: plan.updated_at
      }));
    } catch (error) {
      console.error("Error in getSubscriptionPlans:", error);
      return [];
    }
  }
  
  public async createSubscriptionPlan(plan: CreateSubscriptionPlanInput): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert({
          name: plan.name,
          monthly_price: plan.monthlyPrice,
          annual_price: plan.annualPrice,
          features: plan.features,
          product_limit: plan.productLimit,
          transaction_fee_percentage: plan.transactionFeePercentage,
          is_active: plan.isActive ?? true
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating subscription plan:", error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error("Error in createSubscriptionPlan:", error);
      return null;
    }
  }
  
  public async updateSubscriptionPlan(id: string, plan: UpdateSubscriptionPlanInput): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {};
      
      if (plan.name !== undefined) updateData.name = plan.name;
      if (plan.monthlyPrice !== undefined) updateData.monthly_price = plan.monthlyPrice;
      if (plan.annualPrice !== undefined) updateData.annual_price = plan.annualPrice;
      if (plan.features !== undefined) updateData.features = plan.features;
      if (plan.productLimit !== undefined) updateData.product_limit = plan.productLimit;
      if (plan.transactionFeePercentage !== undefined) updateData.transaction_fee_percentage = plan.transactionFeePercentage;
      if (plan.isActive !== undefined) updateData.is_active = plan.isActive;
      
      const { error } = await supabase
        .from('subscription_plans')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating subscription plan:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateSubscriptionPlan:", error);
      return false;
    }
  }
  
  public async deleteSubscriptionPlan(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting subscription plan:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteSubscriptionPlan:", error);
      return false;
    }
  }
}

export default new SubscriptionPlanService();
