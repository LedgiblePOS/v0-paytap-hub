
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import SubscriptionSelect from "@/components/Onboarding/SubscriptionSelect";
import MerchantForm from "@/components/Onboarding/MerchantForm";
import { SubscriptionTier } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingMerchant, setIsCheckingMerchant] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if merchant profile already exists
  useEffect(() => {
    const checkMerchantProfile = async () => {
      if (user) {
        try {
          const { data: merchant, error } = await supabase
            .from('merchants')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (merchant) {
            // Merchant profile already exists, redirect to dashboard
            toast({
              title: "Already Registered",
              description: "Your merchant account is already set up.",
            });
            navigate("/");
          }
        } catch (error) {
          // This is expected if the merchant doesn't exist yet
          console.log("Merchant profile not found, continuing with onboarding");
        } finally {
          setIsCheckingMerchant(false);
        }
      } else {
        setIsCheckingMerchant(false);
      }
    };

    checkMerchantProfile();
  }, [user, navigate, toast]);

  const handleTierSelect = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
  };

  const handleTierContinue = () => {
    if (!selectedTier) {
      toast({
        title: "Please select a plan",
        description: "You need to select a subscription plan to continue.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleFormBack = () => {
    setStep(1);
  };

  const handleFormSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to complete registration.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Map from camelCase to snake_case for Supabase
      const merchantData = {
        user_id: user.id,
        business_name: data.businessName,
        subscription_tier: selectedTier,
        country: data.country,
        default_currency: data.currency
      };

      // Save merchant data to Supabase
      const { data: merchant, error } = await supabase
        .from('merchants')
        .insert(merchantData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Initialize merchant API credentials with default settings
      if (merchant) {
        const { error: credentialsError } = await supabase
          .from('merchant_api_credentials')
          .insert({
            merchant_id: merchant.id,
            use_fasstap_bridge: data.apiCredentials?.enableFasstap || false,
            use_cbdc: data.apiCredentials?.enableCBDC || false,
            fasstap_username: data.apiCredentials?.fasstapUsername || null,
            fasstap_password: data.apiCredentials?.fasstapPassword || null,
            fasstap_api_url: data.apiCredentials?.fasstapApiUrl || null,
            cbdc_username: data.apiCredentials?.cbdcUsername || null,
            cbdc_password: data.apiCredentials?.cbdcPassword || null,
            cbdc_api_url: data.apiCredentials?.cbdcApiUrl || null
          });

        if (credentialsError) {
          console.error("Error setting up API credentials:", credentialsError);
          // Don't throw error here, as the merchant account is already created
        }
      }

      toast({
        title: "Registration Complete",
        description: "Your business has been registered successfully.",
      });

      // Navigate to dashboard after successful registration
      navigate("/");
    } catch (error: any) {
      console.error("Error saving merchant data:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error setting up your business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingMerchant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ledgible-gray">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-ledgible-blue" />
          <p className="mt-2 text-gray-600">Checking merchant profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ledgible-gray p-4">
      <div className="w-full max-w-4xl">
        <Card>
          <CardContent className="p-8">
            {step === 1 && (
              <SubscriptionSelect
                selectedTier={selectedTier}
                onSelectTier={handleTierSelect}
                onContinue={handleTierContinue}
              />
            )}
            {step === 2 && selectedTier && (
              <MerchantForm
                subscriptionTier={selectedTier}
                onSubmit={handleFormSubmit}
                onBack={handleFormBack}
                isLoading={isLoading}
                includeApiCredentials={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
