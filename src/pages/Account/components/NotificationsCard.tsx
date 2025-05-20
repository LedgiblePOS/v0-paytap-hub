
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const NotificationsCard: React.FC = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    marketingEmails: true,
    securityAlerts: true,
    accountUpdates: true,
    productUpdates: false
  });
  
  const toggleSetting = (setting: keyof typeof emailSettings) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const saveSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
            </div>
            <Switch 
              checked={emailSettings.marketingEmails} 
              onCheckedChange={() => toggleSetting('marketingEmails')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Security Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about security-related events</p>
            </div>
            <Switch 
              checked={emailSettings.securityAlerts} 
              onCheckedChange={() => toggleSetting('securityAlerts')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Account Updates</p>
              <p className="text-sm text-muted-foreground">Receive emails about account changes</p>
            </div>
            <Switch 
              checked={emailSettings.accountUpdates} 
              onCheckedChange={() => toggleSetting('accountUpdates')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Product Updates</p>
              <p className="text-sm text-muted-foreground">Get notified about product changes and updates</p>
            </div>
            <Switch 
              checked={emailSettings.productUpdates} 
              onCheckedChange={() => toggleSetting('productUpdates')} 
            />
          </div>
        </div>
        
        <Button onClick={saveSettings}>Save Notification Settings</Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
