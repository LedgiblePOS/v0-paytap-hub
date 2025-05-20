
/**
 * First Atlantic Commerce Subscription Service
 * Handles subscription-related payment processing
 */

import { supabase } from '@/integrations/supabase/client';
import { processPayment } from './paymentProcessor';
import { PaymentRequest } from './types';

/**
 * Process a subscription upgrade payment and update the merchant's subscription
 */
export const processSubscriptionUpgrade = async (
  merchantId: string,
  subscriptionPlanId: string,
  paymentDetails: PaymentRequest
): Promise<{success: boolean; message: string}> => {
  try {
    // 1. Get the subscription plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', subscriptionPlanId)
      .single();
      
    if (planError || !plan) {
      throw new Error('Invalid subscription plan');
    }
    
    // 2. Process the payment
    const paymentResponse = await processPayment({
      ...paymentDetails,
      amount: plan.monthly_price, // Or annual price depending on billing cycle
      currency: 'USD', // Would come from merchant's settings in real app
      merchantReference: `SUB-${merchantId.slice(0, 8)}-${Date.now()}`
    });
    
    if (!paymentResponse.success) {
      return {
        success: false,
        message: paymentResponse.errorMessage || 'Payment failed'
      };
    }
    
    // 3. Update merchant's subscription
    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        subscription_tier: plan.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', merchantId);
      
    if (updateError) {
      throw new Error('Failed to update subscription');
    }
    
    // 4. Record the transaction
    await supabase.from('transactions').insert({
      merchant_id: merchantId,
      amount: plan.monthly_price,
      status: 'COMPLETED',
      payment_method: 'CREDIT_CARD',
      reference: paymentResponse.transactionId
    });
    
    return {
      success: true,
      message: 'Subscription upgraded successfully'
    };
    
  } catch (error: any) {
    console.error('Subscription upgrade error:', error);
    return {
      success: false,
      message: error.message || 'Subscription upgrade failed'
    };
  }
};
