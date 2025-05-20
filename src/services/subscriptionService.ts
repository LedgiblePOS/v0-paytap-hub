
import { supabase } from "@/integrations/supabase/client";
import auditService from "./auditService";

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isActive: boolean;
}

/**
 * Service for managing subscription plans
 */
class SubscriptionService {
  /**
   * Get all subscription plans
   * @param includeInactive Whether to include inactive plans
   * @returns An array of subscription plans
   */
  public async getSubscriptionPlans(includeInactive: boolean = false): Promise<SubscriptionPlan[]> {
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
        features: plan.features as string[],
        isActive: plan.is_active
      }));
    } catch (error) {
      console.error("Error in getSubscriptionPlans:", error);
      return [];
    }
  }
  
  /**
   * Create a new subscription plan
   * @param plan The subscription plan to create
   * @returns The ID of the created plan, or null if creation failed
   */
  public async createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert({
          name: plan.name,
          monthly_price: plan.monthlyPrice,
          annual_price: plan.annualPrice,
          features: plan.features,
          is_active: plan.isActive
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating subscription plan:", error);
        return null;
      }
      
      // Log the creation
      await auditService.logCreate(
        'subscription_plans',
        data.id,
        `Created subscription plan: ${plan.name}`
      );
      
      return data.id;
    } catch (error) {
      console.error("Error in createSubscriptionPlan:", error);
      return null;
    }
  }
  
  /**
   * Update an existing subscription plan
   * @param id The ID of the plan to update
   * @param plan The updated plan data
   * @returns Whether the update was successful
   */
  public async updateSubscriptionPlan(id: string, plan: Partial<Omit<SubscriptionPlan, 'id'>>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (plan.name !== undefined) updateData.name = plan.name;
      if (plan.monthlyPrice !== undefined) updateData.monthly_price = plan.monthlyPrice;
      if (plan.annualPrice !== undefined) updateData.annual_price = plan.annualPrice;
      if (plan.features !== undefined) updateData.features = plan.features;
      if (plan.isActive !== undefined) updateData.is_active = plan.isActive;
      
      const { error } = await supabase
        .from('subscription_plans')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating subscription plan:", error);
        return false;
      }
      
      // Log the update
      await auditService.logUpdate(
        'subscription_plans',
        id,
        `Updated subscription plan: ${plan.name || id}`
      );
      
      return true;
    } catch (error) {
      console.error("Error in updateSubscriptionPlan:", error);
      return false;
    }
  }
  
  /**
   * Delete a subscription plan
   * @param id The ID of the plan to delete
   * @returns Whether the deletion was successful
   */
  public async deleteSubscriptionPlan(id: string): Promise<boolean> {
    try {
      // Get the plan name before deleting
      const { data: plan, error: fetchError } = await supabase
        .from('subscription_plans')
        .select('name')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching subscription plan:", fetchError);
        return false;
      }
      
      // Delete the plan
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting subscription plan:", error);
        return false;
      }
      
      // Log the deletion
      await auditService.logDelete(
        'subscription_plans',
        id,
        `Deleted subscription plan: ${plan.name}`
      );
      
      return true;
    } catch (error) {
      console.error("Error in deleteSubscriptionPlan:", error);
      return false;
    }
  }
  
  /**
   * Update a merchant's subscription
   * @param merchantId The ID of the merchant
   * @param subscriptionTier The new subscription tier
   * @returns Whether the update was successful
   */
  public async updateMerchantSubscription(merchantId: string, subscriptionTier: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('merchants')
        .update({
          subscription_tier: subscriptionTier,
          updated_at: new Date().toISOString()
        })
        .eq('id', merchantId);
      
      if (error) {
        console.error("Error updating merchant subscription:", error);
        return false;
      }
      
      // Log the update
      await auditService.logUpdate(
        'merchants',
        merchantId,
        `Updated subscription to: ${subscriptionTier}`
      );
      
      return true;
    } catch (error) {
      console.error("Error in updateMerchantSubscription:", error);
      return false;
    }
  }
}

export default new SubscriptionService();
