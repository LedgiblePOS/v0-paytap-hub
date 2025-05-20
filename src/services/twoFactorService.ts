
import { supabase } from "@/integrations/supabase/client";

/**
 * Store a verification code for the user
 */
export const storeVerificationCode = async (
  userId: string,
  code: string,
  expiresInMinutes: number = 10
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Generate expiration timestamp
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
    
    // Check if there's an existing verification record
    const { data: existingVerification, error: fetchError } = await supabase
      .from('merchant_verifications')
      .select('*')
      .eq('merchant_id', userId)
      .eq('verification_type', 'TWO_FACTOR_CODE')
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching verification record:', fetchError);
      return { success: false, error: 'Failed to check existing verification records' };
    }
    
    // Store verification data with the code and expiration time
    const verificationData = {
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0
    };
    
    if (existingVerification) {
      // Get the current verification data as an object
      let currentData = {};
      if (existingVerification.verification_data && 
          typeof existingVerification.verification_data === 'object') {
        currentData = existingVerification.verification_data;
      }
      
      // Update the verification data
      const { error: updateError } = await supabase
        .from('merchant_verifications')
        .update({
          verification_data: {
            ...currentData,
            code,
            expires_at: expiresAt.toISOString(),
            attempts: 0
          }
        })
        .eq('id', existingVerification.id);
      
      if (updateError) throw updateError;
    } else {
      // Create a new record
      const { error: insertError } = await supabase
        .from('merchant_verifications')
        .insert({
          merchant_id: userId,
          verification_type: 'TWO_FACTOR_CODE',
          is_verified: false,
          verification_data: verificationData
        });
      
      if (insertError) throw insertError;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error storing verification code:', error);
    return { success: false, error: error.message || 'Failed to store verification code' };
  }
};

/**
 * Verify a code entered by the user
 */
export const verifyCode = async (
  userId: string,
  enteredCode: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the stored verification record
    const { data: verification, error } = await supabase
      .from('merchant_verifications')
      .select('*')
      .eq('merchant_id', userId)
      .eq('verification_type', 'TWO_FACTOR_CODE')
      .single();
    
    if (error) {
      return { success: false, error: 'No verification code found' };
    }
    
    // Get the verification data from the record
    const verificationData = verification.verification_data;
    
    // Ensure verificationData is an object and handle safely
    if (!verificationData || typeof verificationData !== 'object') {
      return { success: false, error: 'Invalid verification data format' };
    }
    
    // Safely access properties with type checking
    let attempts = 0;
    if (verificationData && typeof verificationData === 'object' && 'attempts' in verificationData) {
      attempts = typeof verificationData.attempts === 'number' ? verificationData.attempts + 1 : 1;
    } else {
      attempts = 1;
    }
    
    // Check if too many attempts
    if (attempts > 5) {
      // Update attempts safely
      await supabase
        .from('merchant_verifications')
        .update({
          verification_data: {
            ...(typeof verificationData === 'object' ? verificationData : {}),
            attempts
          }
        })
        .eq('id', verification.id);
      
      return { success: false, error: 'Too many attempts. Please request a new code.' };
    }
    
    // Check if code is expired - with type safety
    if (verificationData && 
        typeof verificationData === 'object' && 
        'expires_at' in verificationData && 
        typeof verificationData.expires_at === 'string') {
      const expiresAt = new Date(verificationData.expires_at);
      if (expiresAt < new Date()) {
        return { success: false, error: 'Verification code has expired. Please request a new code.' };
      }
    }
    
    // Check if code matches - with type safety
    const storedCode = verificationData && 
                       typeof verificationData === 'object' && 
                       'code' in verificationData ? 
                       verificationData.code : 
                       null;
                       
    if (storedCode !== enteredCode) {
      // Update attempts count safely
      await supabase
        .from('merchant_verifications')
        .update({
          verification_data: {
            ...(typeof verificationData === 'object' ? verificationData : {}),
            attempts
          }
        })
        .eq('id', verification.id);
      
      return { success: false, error: 'Invalid verification code' };
    }
    
    // Code is valid, mark as verified
    await supabase
      .from('merchant_verifications')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verification_data: {
          ...(typeof verificationData === 'object' ? verificationData : {}),
          attempts
        }
      })
      .eq('id', verification.id);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error verifying code:', error);
    return { success: false, error: error.message || 'Failed to verify code' };
  }
};
