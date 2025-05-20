
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ApiCredentialsForm } from "../schema";
import CheckoutService from "@/services/checkoutService";

export const useSettingsData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [useBridge, setUseBridge] = useState(false);
  const [useCBDC, setUseCBDC] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<ApiCredentialsForm>({
    fasstapUsername: "",
    fasstapPassword: "",
    fasstapApiUrl: "",
    cbdcUsername: "",
    cbdcPassword: "",
    cbdcApiUrl: "",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (merchantError) throw merchantError;

        setMerchantId(merchant?.id || null);

        const { data: credentials, error: credentialsError } = await supabase
          .from('merchant_api_credentials')
          .select('*')
          .eq('merchant_id', merchant?.id)
          .single();

        if (credentialsError && credentialsError.code !== '404') throw credentialsError;

        if (credentials) {
          setInitialFormValues({
            fasstapUsername: credentials.fasstap_username || "",
            fasstapPassword: credentials.fasstap_password || "",
            fasstapApiUrl: credentials.fasstap_api_url || "",
            cbdcUsername: credentials.cbdc_username || "",
            cbdcPassword: credentials.cbdc_password || "",
            cbdcApiUrl: credentials.cbdc_api_url || "",
          });

          setUseBridge(credentials.use_fasstap_bridge || false);
          setUseCBDC(credentials.use_cbdc || false);

          // Use instance methods on the CheckoutService instance
          CheckoutService.toggleBridgeMode(credentials.use_fasstap_bridge || false);
          CheckoutService.toggleCBDCMode(credentials.use_cbdc || false);
        }
      } catch (error: any) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error loading settings",
          description: error.message || "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user?.id, toast]);

  const updateCredentialSettings = async (settings: { use_fasstap_bridge?: boolean; use_cbdc?: boolean }) => {
    if (!merchantId) {
      toast({
        title: "Error",
        description: "Merchant ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('merchant_api_credentials')
        .upsert(
          { merchant_id: merchantId, ...settings },
          { onConflict: 'merchant_id' }
        );

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Toggle settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating toggle settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update toggle settings",
        variant: "destructive",
      });
    }
  };

  const handleToggleBridge = (checked: boolean) => {
    setUseBridge(checked);
    CheckoutService.toggleBridgeMode(checked);
    updateCredentialSettings({ use_fasstap_bridge: checked });
  };

  const handleToggleCBDC = (checked: boolean) => {
    setUseCBDC(checked);
    CheckoutService.toggleCBDCMode(checked);
    updateCredentialSettings({ use_cbdc: checked });
  };

  const handleSubmitCredentials = async (data: ApiCredentialsForm) => {
    if (!merchantId) {
      toast({
        title: "Error",
        description: "Merchant ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('merchant_api_credentials')
        .upsert(
          {
            merchant_id: merchantId,
            fasstap_username: data.fasstapUsername,
            fasstap_password: data.fasstapPassword,
            fasstap_api_url: data.fasstapApiUrl,
            cbdc_username: data.cbdcUsername,
            cbdc_password: data.cbdcPassword,
            cbdc_api_url: data.cbdcApiUrl,
            use_fasstap_bridge: useBridge,
            use_cbdc: useCBDC
          },
          { onConflict: 'merchant_id' }
        );

      if (error) throw error;

      toast({
        title: "Credentials updated",
        description: "API credentials have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating credentials:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    isLoading,
    useBridge,
    useCBDC,
    initialFormValues,
    handleToggleBridge,
    handleToggleCBDC,
    handleSubmitCredentials
  };
};
