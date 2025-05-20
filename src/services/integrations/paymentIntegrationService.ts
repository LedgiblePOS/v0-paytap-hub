
import { supabase } from '@/integrations/supabase/client';
import { PaymentIntegration, PaymentIntegrationLog } from '@/types/integrations';

export const paymentIntegrationService = {
  async getIntegrations(merchantId: string): Promise<PaymentIntegration[]> {
    const { data, error } = await supabase
      .from('payment_integrations')
      .select('*')
      .eq('merchant_id', merchantId);

    if (error) throw error;
    return data || [];
  },

  async getIntegrationById(id: string): Promise<PaymentIntegration | null> {
    const { data, error } = await supabase
      .from('payment_integrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createIntegration(integration: Partial<PaymentIntegration>): Promise<PaymentIntegration> {
    const { data, error } = await supabase
      .from('payment_integrations')
      .insert([integration])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateIntegration(id: string, updates: Partial<PaymentIntegration>): Promise<PaymentIntegration> {
    const { data, error } = await supabase
      .from('payment_integrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async logIntegrationEvent(log: Partial<PaymentIntegrationLog>): Promise<void> {
    const { error } = await supabase
      .from('payment_integration_logs')
      .insert([log]);

    if (error) throw error;
  }
};
