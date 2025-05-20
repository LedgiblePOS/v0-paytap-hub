
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { systemSettingsService, securitySettingsService } from "@/services/settings";
import type { SystemSettings, SecuritySettings } from "@/types/settings";
import { SystemSettingsFormValues } from "../components/settings/GeneralSettingsForm";
import { SecuritySettingsFormValues } from "../components/settings/SecuritySettingsForm";

export function useAdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("general");

  // Query to fetch system settings
  const { 
    data: systemData, 
    isLoading: systemLoading 
  } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: systemSettingsService.getSystemSettings,
  });

  // Query to fetch security settings
  const { 
    data: securityData, 
    isLoading: securityLoading 
  } = useQuery({
    queryKey: ['securitySettings'],
    queryFn: securitySettingsService.getSecuritySettings,
  });

  // Default values for the general settings form
  const generalDefaultValues = {
    siteName: systemData?.siteName || "Ledgible Go",
    supportEmail: systemData?.supportEmail || "support@ledgible.app",
    maintenanceMode: systemData?.maintenanceMode || false,
    allowPublicRegistration: systemData?.allowPublicRegistration || true,
    requireEmailVerification: systemData?.requireEmailVerification || true,
    apiRequestLimit: systemData?.apiRequestLimit || 1000,
  };

  // Default values for the security settings form
  const securityDefaultValues = {
    passwordMinLength: securityData?.passwordMinLength || 8,
    passwordRequireSpecialChars: securityData?.passwordRequireSpecialChars || true,
    passwordRequireNumbers: securityData?.passwordRequireNumbers || true,
    maxLoginAttempts: securityData?.maxLoginAttempts || 5,
    sessionTimeout: securityData?.sessionTimeout || 60,
  };

  // Mutations for updating settings
  const systemMutation = useMutation({
    mutationFn: (data: SystemSettings) => systemSettingsService.updateSystemSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save system settings.",
        variant: "destructive",
      });
    }
  });

  const securityMutation = useMutation({
    mutationFn: (data: SecuritySettings) => securitySettingsService.updateSecuritySettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securitySettings'] });
      toast({
        title: "Settings Saved",
        description: "Security settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save security settings.",
        variant: "destructive",
      });
    }
  });

  // Handle system settings save
  const handleSaveSystemSettings = (data: SystemSettingsFormValues) => {
    const settingsData: SystemSettings = {
      siteName: data.siteName,
      supportEmail: data.supportEmail,
      maintenanceMode: data.maintenanceMode,
      allowPublicRegistration: data.allowPublicRegistration,
      requireEmailVerification: data.requireEmailVerification,
      apiRequestLimit: data.apiRequestLimit,
    };
    systemMutation.mutate(settingsData);
  };

  // Handle security settings save
  const handleSaveSecuritySettings = (data: SecuritySettingsFormValues) => {
    const securityData: SecuritySettings = {
      passwordMinLength: data.passwordMinLength,
      passwordRequireSpecialChars: data.passwordRequireSpecialChars,
      passwordRequireNumbers: data.passwordRequireNumbers,
      maxLoginAttempts: data.maxLoginAttempts,
      sessionTimeout: data.sessionTimeout,
    };
    securityMutation.mutate(securityData);
  };

  const isLoading = 
    systemLoading || 
    securityLoading || 
    systemMutation.isPending || 
    securityMutation.isPending;

  return {
    activeTab,
    setActiveTab,
    generalDefaultValues,
    securityDefaultValues,
    isLoading,
    systemMutation,
    securityMutation,
    handleSaveSystemSettings,
    handleSaveSecuritySettings,
  };
}
