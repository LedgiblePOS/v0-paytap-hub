
import { supabase } from "@/integrations/supabase/client";
import { MerchantApiCredentials } from "./types";

/**
 * Manages API credentials for merchants
 */
class CredentialsManager {
  private credentials: MerchantApiCredentials | null = null;
  
  /**
   * Load credentials for a merchant
   */
  public async loadCredentials(merchantId: string): Promise<MerchantApiCredentials | null> {
    try {
      // First try to get credentials from merchant_api_credentials table
      const { data: apiCreds, error: apiCredsError } = await supabase
        .from("merchant_api_credentials")
        .select(`
          id, 
          merchant_id,
          fasstap_username,
          fasstap_password,
          fasstap_api_url,
          cbdc_username,
          cbdc_password,
          cbdc_api_url,
          use_fasstap_bridge,
          use_cbdc
        `)
        .eq("merchant_id", merchantId)
        .maybeSingle();
      
      if (apiCredsError) {
        console.error("Error fetching merchant API credentials:", apiCredsError);
      }
      
      // Then try to get WiPay credentials from wipay_api_credentials table
      const { data: wipayCreds, error: wipayCredsError } = await supabase
        .from("wipay_api_credentials")
        .select(`
          wipay_username,
          wipay_password,
          wipay_api_url,
          apple_pay_enabled,
          google_pay_enabled
        `)
        .eq("merchant_id", merchantId)
        .maybeSingle();
        
      if (wipayCredsError) {
        console.error("Error fetching WiPay credentials:", wipayCredsError);
      }
      
      // Combine credentials from both tables
      this.credentials = {
        id: apiCreds?.id,
        merchant_id: merchantId,
        fasstap_username: apiCreds?.fasstap_username || null,
        fasstap_password: apiCreds?.fasstap_password || null,
        fasstap_api_url: apiCreds?.fasstap_api_url || null,
        cbdc_username: apiCreds?.cbdc_username || null,
        cbdc_password: apiCreds?.cbdc_password || null,
        cbdc_api_url: apiCreds?.cbdc_api_url || null,
        use_fasstap_bridge: apiCreds?.use_fasstap_bridge || false,
        use_cbdc: apiCreds?.use_cbdc || false,
        wipay_username: wipayCreds?.wipay_username || null,
        wipay_password: wipayCreds?.wipay_password || null,
        wipay_api_url: wipayCreds?.wipay_api_url || null,
        wipay_enabled: !!wipayCreds?.wipay_username, // Enable if username exists
        apple_pay_enabled: wipayCreds?.apple_pay_enabled || false,
        google_pay_enabled: wipayCreds?.google_pay_enabled || false,
        created_at: apiCreds?.created_at || new Date().toISOString(),
        updated_at: apiCreds?.updated_at || new Date().toISOString()
      };
      
      return this.credentials;
    } catch (error) {
      console.error("Error in loadCredentials:", error);
      return null;
    }
  }
  
  /**
   * Get stored credentials
   */
  public getCredentials(): MerchantApiCredentials | null {
    return this.credentials;
  }
  
  /**
   * Save API credentials
   */
  public async saveCredentials(credentials: {
    merchantId: string;
    fasstapUsername?: string | null;
    fasstapPassword?: string | null;
    fasstapApiUrl?: string | null;
    cbdcUsername?: string | null;
    cbdcPassword?: string | null;
    cbdcApiUrl?: string | null;
    useFasstapBridge?: boolean;
    useCBDC?: boolean;
    wipayUsername?: string | null;
    wipayPassword?: string | null;
    wipayApiUrl?: string | null;
    wipayEnabled?: boolean;
  }): Promise<boolean> {
    try {
      // First check if credentials exist
      const { data: existingCreds, error: checkError } = await supabase
        .from("merchant_api_credentials")
        .select("id")
        .eq("merchant_id", credentials.merchantId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking credentials:", checkError);
        return false;
      }
      
      // Save main API credentials
      const apiCredsData = {
        merchant_id: credentials.merchantId,
        fasstap_username: credentials.fasstapUsername,
        fasstap_password: credentials.fasstapPassword,
        fasstap_api_url: credentials.fasstapApiUrl,
        cbdc_username: credentials.cbdcUsername,
        cbdc_password: credentials.cbdcPassword,
        cbdc_api_url: credentials.cbdcApiUrl,
        use_fasstap_bridge: credentials.useFasstapBridge,
        use_cbdc: credentials.useCBDC
      };
      
      let apiCredsResult;
      if (existingCreds?.id) {
        // Update existing record
        apiCredsResult = await supabase
          .from("merchant_api_credentials")
          .update(apiCredsData)
          .eq("id", existingCreds.id);
      } else {
        // Insert new record
        apiCredsResult = await supabase
          .from("merchant_api_credentials")
          .insert(apiCredsData);
      }
      
      if (apiCredsResult.error) {
        console.error("Error saving API credentials:", apiCredsResult.error);
        return false;
      }
      
      // Now handle WiPay credentials if provided
      if (credentials.wipayUsername || credentials.wipayPassword || credentials.wipayApiUrl) {
        // Check if WiPay credentials exist
        const { data: existingWiPay, error: wipayCheckError } = await supabase
          .from("wipay_api_credentials")
          .select("id")
          .eq("merchant_id", credentials.merchantId)
          .maybeSingle();
          
        if (wipayCheckError) {
          console.error("Error checking WiPay credentials:", wipayCheckError);
          // Continue as we can still try to save the data
        }
        
        const wipayData = {
          merchant_id: credentials.merchantId,
          wipay_username: credentials.wipayUsername,
          wipay_password: credentials.wipayPassword,
          wipay_api_url: credentials.wipayApiUrl
        };
        
        let wipayResult;
        if (existingWiPay?.id) {
          // Update existing record
          wipayResult = await supabase
            .from("wipay_api_credentials")
            .update(wipayData)
            .eq("id", existingWiPay.id);
        } else {
          // Insert new record
          wipayResult = await supabase
            .from("wipay_api_credentials")
            .insert(wipayData);
        }
        
        if (wipayResult.error) {
          console.error("Error saving WiPay credentials:", wipayResult.error);
          // We already saved the main credentials, so still return true
        }
      }
      
      // Reload credentials
      await this.loadCredentials(credentials.merchantId);
      return true;
    } catch (error) {
      console.error("Error in saveCredentials:", error);
      return false;
    }
  }
}

export default new CredentialsManager();
