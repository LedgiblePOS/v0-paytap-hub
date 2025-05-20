
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";
import GeneralSettingsForm from "./components/settings/GeneralSettingsForm";
import SecuritySettingsForm from "./components/settings/SecuritySettingsForm";
import TransactionFeeSettings from "./components/settings/TransactionFeeSettings";
import { Shield, Settings as SettingsIcon, CreditCard } from "lucide-react";
import auditService from "@/services/auditService";

const SuperAdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("general");
  
  const {
    settings: generalSettings,
    isLoading: generalLoading,
    updateSettings: updateGeneralSettings
  } = useSystemSettings();
  
  const {
    settings: securitySettings,
    isLoading: securityLoading,
    updateSettings: updateSecuritySettings
  } = useSecuritySettings();
  
  const isLoading = generalLoading || securityLoading;
  
  const handleSaveSystemSettings = async (values: any) => {
    await updateGeneralSettings(values);
    auditService.logAction('UPDATE', 'SYSTEM_SETTINGS', 'Updated system settings');
  };
  
  const handleSaveSecuritySettings = async (values: any) => {
    await updateSecuritySettings(values);
    auditService.logAction('UPDATE', 'SECURITY_SETTINGS', 'Updated security settings');
  };

  // Default values for the forms
  const generalDefaultValues = {
    siteName: generalSettings?.siteName || "Ledgible Go",
    supportEmail: generalSettings?.supportEmail || "support@ledgible.app",
    maintenanceMode: generalSettings?.maintenanceMode || false,
    allowPublicRegistration: generalSettings?.allowPublicRegistration || true,
    requireEmailVerification: generalSettings?.requireEmailVerification || false,
    apiRequestLimit: generalSettings?.apiRequestLimit || 1000,
  };
  
  const securityDefaultValues = {
    passwordMinLength: securitySettings?.passwordMinLength || 8,
    passwordRequireSpecialChars: securitySettings?.passwordRequireSpecialChars || true,
    passwordRequireNumbers: securitySettings?.passwordRequireNumbers || true,
    maxLoginAttempts: securitySettings?.maxLoginAttempts || 5,
    sessionTimeout: securitySettings?.sessionTimeout || 60,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Global System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings for the entire platform.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Transaction Fees
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>
                Adjust core platform settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettingsForm
                defaultValues={generalDefaultValues}
                isLoading={isLoading}
                onSubmit={handleSaveSystemSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Configure security settings for the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettingsForm
                defaultValues={securityDefaultValues}
                isLoading={isLoading}
                onSubmit={handleSaveSecuritySettings}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transaction Fee Settings Tab */}
        <TabsContent value="transactions">
          <TransactionFeeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminSettings;
