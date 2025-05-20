
import { supabase } from "@/integrations/supabase/client";

/**
 * Manages payment settings
 */
class SettingsManager {
  private useBridge: boolean = false;
  private useCBDC: boolean = false;
  
  constructor() {
    // Load settings from localStorage
    this.useBridge = localStorage.getItem("USE_FASSTAP_BRIDGE") === "true";
    this.useCBDC = localStorage.getItem("USE_CBDC") === "true";
  }
  
  /**
   * Toggle the use of the Fasstap Bridge implementation
   */
  public toggleBridgeMode(enable: boolean): void {
    this.useBridge = enable;
    localStorage.setItem("USE_FASSTAP_BRIDGE", enable ? "true" : "false");
    
    // Update database settings
    this.saveSettings();
  }

  /**
   * Toggle the use of CBDC
   */
  public toggleCBDCMode(enable: boolean): void {
    this.useCBDC = enable;
    localStorage.setItem("USE_CBDC", enable ? "true" : "false");
    
    // Update database settings
    this.saveSettings();
  }
  
  /**
   * Check if bridge mode is enabled
   */
  public isBridgeEnabled(): boolean {
    return this.useBridge;
  }

  /**
   * Check if CBDC mode is enabled
   */
  public isCBDCEnabled(): boolean {
    return this.useCBDC;
  }
  
  /**
   * Save settings to database
   */
  private async saveSettings(): Promise<void> {
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // Get merchant ID for the current user
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      
      if (merchantError || !merchant) {
        console.error("Error loading merchant:", merchantError);
        return;
      }
      
      // Check if credentials exist
      const { data: credentials, error: checkError } = await supabase
        .from('merchant_api_credentials')
        .select('id')
        .eq('merchant_id', merchant.id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking credentials:", checkError);
        return;
      }
      
      if (credentials?.id) {
        // Update existing record
        const { error } = await supabase
          .from('merchant_api_credentials')
          .update({
            use_fasstap_bridge: this.useBridge,
            use_cbdc: this.useCBDC
          })
          .eq('id', credentials.id);
          
        if (error) console.error("Error updating settings:", error);
      } else {
        // Insert new record
        const { error } = await supabase
          .from('merchant_api_credentials')
          .insert({
            merchant_id: merchant.id,
            use_fasstap_bridge: this.useBridge,
            use_cbdc: this.useCBDC
          });
          
        if (error) console.error("Error inserting settings:", error);
      }
    } catch (error) {
      console.error("Error in saveSettings:", error);
    }
  }
  
  /**
   * Load settings from database
   */
  public async loadSettings(merchantId: string): Promise<void> {
    try {
      // Get merchant API credentials
      const { data: credentials, error: credentialsError } = await supabase
        .from('merchant_api_credentials')
        .select('use_fasstap_bridge, use_cbdc')
        .eq('merchant_id', merchantId)
        .maybeSingle();
      
      if (credentialsError) {
        console.error("Error loading settings:", credentialsError);
        return;
      }
      
      if (credentials) {
        this.useBridge = credentials.use_fasstap_bridge || false;
        this.useCBDC = credentials.use_cbdc || false;
        
        // Update localStorage
        localStorage.setItem("USE_FASSTAP_BRIDGE", this.useBridge ? "true" : "false");
        localStorage.setItem("USE_CBDC", this.useCBDC ? "true" : "false");
      }
    } catch (error) {
      console.error("Error in loadSettings:", error);
    }
  }
}

export default new SettingsManager();
