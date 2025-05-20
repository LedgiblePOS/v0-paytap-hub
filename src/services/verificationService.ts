
import { supabase } from "@/integrations/supabase/client";
import { MerchantVerification, dbToMerchantVerification } from "@/types/merchant";

export const getVerifications = async (): Promise<MerchantVerification[]> => {
  try {
    const { data, error } = await supabase
      .from('merchant_verifications')
      .select(`
        *,
        merchants (
          id,
          user_id,
          business_name,
          business_logo,
          subscription_tier,
          product_limit,
          product_count,
          country,
          default_currency,
          created_at,
          updated_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(dbToMerchantVerification);
  } catch (error: any) {
    console.error('Error fetching verifications:', error);
    throw error;
  }
};

export const getVerificationById = async (id: string): Promise<MerchantVerification | null> => {
  try {
    const { data, error } = await supabase
      .from('merchant_verifications')
      .select(`
        *,
        merchants (
          id,
          user_id,
          business_name,
          business_logo,
          subscription_tier,
          product_limit,
          product_count,
          country,
          default_currency,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return dbToMerchantVerification(data);
  } catch (error: any) {
    console.error('Error fetching verification:', error);
    throw error;
  }
};

// Add missing methods
export const getVerificationStatus = async (merchantId: string): Promise<MerchantVerification | null> => {
  try {
    const { data, error } = await supabase
      .from('merchant_verifications')
      .select(`
        *,
        merchants (
          id,
          user_id,
          business_name,
          business_logo,
          subscription_tier,
          product_limit,
          product_count,
          country,
          default_currency,
          created_at,
          updated_at
        )
      `)
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    if (!data) return null;

    return dbToMerchantVerification(data);
  } catch (error: any) {
    console.error('Error fetching verification status:', error);
    throw error;
  }
};

export const submitVerification = async (verification: Partial<MerchantVerification>): Promise<MerchantVerification> => {
  try {
    const { data, error } = await supabase
      .from('merchant_verifications')
      .insert({
        merchant_id: verification.merchantId,
        verification_type: verification.verificationType,
        document_urls: verification.documentUrls,
        verification_data: verification.verificationData,
        status: 'pending',
        is_verified: false
      })
      .select(`
        *,
        merchants (
          id,
          user_id,
          business_name,
          business_logo,
          subscription_tier,
          product_limit,
          product_count,
          country,
          default_currency,
          created_at,
          updated_at
        )
      `)
      .single();

    if (error) throw error;

    return dbToMerchantVerification(data);
  } catch (error: any) {
    console.error('Error submitting verification:', error);
    throw error;
  }
};

// Add helper function for converting from DB format to MerchantVerification
export const dbToMerchantVerification = (data: any): MerchantVerification => {
  return {
    id: data.id,
    merchantId: data.merchant_id,
    isVerified: data.is_verified,
    status: data.status,
    verificationType: data.verification_type,
    verificationData: data.verification_data,
    documentUrls: data.document_urls,
    rejectionReason: data.rejection_reason,
    verifiedAt: data.verified_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    merchant: data.merchants
  };
};
