
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const GlobalSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [platformSettings, setPlatformSettings] = useState({
    siteName: "Ledgible Go",
    supportEmail: "support@ledgible.app",
    apiRequestLimit: "1000",
    allowPublicRegistration: true,
    requireEmailVerification: true,
    enableMaintenanceMode: false,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlatformSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setPlatformSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real implementation, this would save to a database
    toast({
      title: "Settings Saved",
      description: "Platform settings have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>
            Configure global settings for the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={platformSettings.siteName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  value={platformSettings.supportEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* API Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">API Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiRequestLimit">API Request Limit (per day)</Label>
                <Input
                  id="apiRequestLimit"
                  name="apiRequestLimit"
                  type="number"
                  value={platformSettings.apiRequestLimit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Security & Access</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowPublicRegistration">Allow Public Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, new users can sign up through the registration page
                  </p>
                </div>
                <Switch
                  id="allowPublicRegistration"
                  checked={platformSettings.allowPublicRegistration}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("allowPublicRegistration", checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    New accounts must verify their email before accessing the system
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={platformSettings.requireEmailVerification}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("requireEmailVerification", checked)
                  }
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Maintenance Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Maintenance</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableMaintenanceMode" className="text-red-500 font-medium">
                  Enable Maintenance Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, only super admins can access the system
                </p>
              </div>
              <Switch
                id="enableMaintenanceMode"
                checked={platformSettings.enableMaintenanceMode}
                onCheckedChange={(checked) => 
                  handleSwitchChange("enableMaintenanceMode", checked)
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="mr-2">
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GlobalSettings;
