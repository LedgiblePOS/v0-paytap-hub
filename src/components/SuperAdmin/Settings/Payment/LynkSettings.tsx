
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Create a FormGroup component since it doesn't exist in UI library
const FormGroup: React.FC<{ children: React.ReactNode, className?: string }> = ({ 
  children, 
  className = "space-y-2 mb-4" 
}) => {
  return <div className={className}>{children}</div>;
};

const LynkSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    lynkClientId: '',
    lynkClientSecret: '',
    lynkAccountId: '',
    lynkApiUrl: '',
    lynkNotificationUrl: '',
    lynkEnabled: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        // Use platform_lynk_settings table instead of payment_settings
        const { data, error } = await supabase
          .from('platform_lynk_settings')
          .select('*')
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            lynkClientId: data.lynk_client_id || '',
            lynkClientSecret: data.lynk_client_secret || '',
            lynkAccountId: data.lynk_account_id || '',
            lynkApiUrl: data.lynk_api_url || '',
            lynkNotificationUrl: data.lynk_notification_url || '',
            lynkEnabled: data.lynk_enabled || false
          });
        }
      } catch (error) {
        console.error('Error fetching Lynk settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load Lynk payment settings.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, lynkEnabled: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Convert to snake_case for database
      const dbData = {
        lynk_client_id: formData.lynkClientId,
        lynk_client_secret: formData.lynkClientSecret,
        lynk_account_id: formData.lynkAccountId,
        lynk_api_url: formData.lynkApiUrl,
        lynk_notification_url: formData.lynkNotificationUrl,
        lynk_enabled: formData.lynkEnabled,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('platform_lynk_settings')
        .upsert(dbData);
      
      if (error) throw error;
      
      toast({
        title: 'Settings Saved',
        description: 'Lynk payment settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving Lynk settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save Lynk payment settings.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lynk Gateway Settings</CardTitle>
          <CardDescription>Configure your Lynk payment gateway integration</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lynk Gateway Settings</CardTitle>
        <CardDescription>Configure your Lynk payment gateway integration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup>
            <div>
              <Label htmlFor="lynkEnabled">Enable Lynk Payments</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Switch 
                  id="lynkEnabled"
                  checked={formData.lynkEnabled}
                  onCheckedChange={handleSwitchChange}
                />
                <span className="text-sm text-muted-foreground">
                  {formData.lynkEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </FormGroup>

          <FormGroup>
            <div>
              <Label htmlFor="lynkClientId">Client ID</Label>
              <Input
                id="lynkClientId"
                name="lynkClientId"
                placeholder="Enter your Lynk client ID"
                value={formData.lynkClientId}
                onChange={handleInputChange}
              />
            </div>
          </FormGroup>

          <FormGroup>
            <div>
              <Label htmlFor="lynkClientSecret">Client Secret</Label>
              <Input
                id="lynkClientSecret"
                name="lynkClientSecret"
                placeholder="Enter your Lynk client secret"
                value={formData.lynkClientSecret}
                onChange={handleInputChange}
                type="password"
              />
            </div>
          </FormGroup>

          <FormGroup>
            <div>
              <Label htmlFor="lynkAccountId">Account ID</Label>
              <Input
                id="lynkAccountId"
                name="lynkAccountId"
                placeholder="Enter your Lynk account ID"
                value={formData.lynkAccountId}
                onChange={handleInputChange}
              />
            </div>
          </FormGroup>

          <FormGroup>
            <div>
              <Label htmlFor="lynkApiUrl">API URL</Label>
              <Input
                id="lynkApiUrl"
                name="lynkApiUrl"
                placeholder="Enter Lynk API URL"
                value={formData.lynkApiUrl}
                onChange={handleInputChange}
              />
            </div>
          </FormGroup>

          <FormGroup>
            <div>
              <Label htmlFor="lynkNotificationUrl">Notification URL</Label>
              <Input
                id="lynkNotificationUrl"
                name="lynkNotificationUrl"
                placeholder="Enter webhook notification URL"
                value={formData.lynkNotificationUrl}
                onChange={handleInputChange}
              />
            </div>
          </FormGroup>

          <div className="mt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LynkSettings;
