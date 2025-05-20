
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getTaxSettings, saveTaxSettings, getDefaultTaxSettings, TaxSettings } from "@/services/tax/taxSettingsService";
import { TaxJurisdiction, getJurisdictionById } from "@/services/tax/taxJurisdictions";

export type TaxSettingsFormValues = Omit<TaxSettings, "merchantId">;

export const useTaxSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<TaxSettingsFormValues>({
    salesTaxRate: 7.5,
    stateTaxRate: 4.0,
    localTaxRate: 2.0,
    applyTaxToAllProducts: true,
    jurisdictionId: 'custom'
  });
  
  // Load tax settings on component mount
  useEffect(() => {
    const loadTaxSettings = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      
      try {
        const merchantId = user.id;
        const settings = await getTaxSettings(merchantId);
        
        if (settings) {
          setDefaultValues({
            salesTaxRate: settings.salesTaxRate,
            stateTaxRate: settings.stateTaxRate,
            localTaxRate: settings.localTaxRate,
            applyTaxToAllProducts: settings.applyTaxToAllProducts,
            jurisdictionId: settings.jurisdictionId || 'custom',
          });
        } else {
          const defaultSettings = getDefaultTaxSettings(merchantId);
          setDefaultValues({
            salesTaxRate: defaultSettings.salesTaxRate,
            stateTaxRate: defaultSettings.stateTaxRate,
            localTaxRate: defaultSettings.localTaxRate,
            applyTaxToAllProducts: defaultSettings.applyTaxToAllProducts,
            jurisdictionId: defaultSettings.jurisdictionId || 'custom',
          });
        }
      } catch (error) {
        console.error("Error loading tax settings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tax settings",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTaxSettings();
  }, [user, toast]);

  const onSubmit = async (data: TaxSettingsFormValues) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save tax settings",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const taxSettings: TaxSettings = {
        merchantId: user.id,
        salesTaxRate: data.salesTaxRate,
        stateTaxRate: data.stateTaxRate,
        localTaxRate: data.localTaxRate,
        applyTaxToAllProducts: data.applyTaxToAllProducts,
        jurisdictionId: data.jurisdictionId,
      };
      
      const success = await saveTaxSettings(taxSettings);
      
      if (success) {
        toast({
          title: "Settings saved",
          description: "Your tax settings have been updated successfully",
        });
      } else {
        throw new Error("Failed to save tax settings");
      }
    } catch (error) {
      console.error("Error saving tax settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tax settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJurisdictionSelect = (jurisdiction: TaxJurisdiction) => {
    if (jurisdiction.id === 'custom') return;
    
    setDefaultValues(prev => ({
      ...prev,
      salesTaxRate: jurisdiction.salesTaxRate,
      stateTaxRate: jurisdiction.stateTaxRate,
      localTaxRate: jurisdiction.localTaxRate,
      jurisdictionId: jurisdiction.id,
    }));
  };

  return {
    defaultValues,
    isLoading,
    onSubmit,
    handleJurisdictionSelect
  };
};
