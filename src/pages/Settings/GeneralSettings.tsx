
import React from 'react';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@/components/ui/switch';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const GeneralSettings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      businessName: '',
      emailNotifications: true,
      darkMode: false,
      language: 'en',
    }
  });

  const handleSaveSettings = (values: any) => {
    toast({
      title: "Settings Updated",
      description: "Your general settings have been saved successfully.",
    });
    console.log('Settings saved:', values);
  };

  return (
    <MainLayoutContent>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">General Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  placeholder="Enter your business name"
                  defaultValue={user?.merchantId ? "Your Business" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  disabled
                  value={user?.email || ""}
                />
                <p className="text-sm text-muted-foreground">
                  Your email address is used for notifications and login.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important updates.</p>
                </div>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the application interface.</p>
                </div>
                <Switch id="darkMode" />
              </div>
              
              <Button 
                className="mt-4"
                onClick={form.handleSubmit(handleSaveSettings)}
              >
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayoutContent>
  );
};

export default GeneralSettings;
