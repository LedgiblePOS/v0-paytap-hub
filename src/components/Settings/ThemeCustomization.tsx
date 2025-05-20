
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MerchantCustomizationEntity } from '@/types/merchantCustomization';

const ThemeCustomization: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customization, setCustomization] = useState<MerchantCustomizationEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      if (!user?.merchantId) return;

      try {
        const { data, error } = await supabase
          .from('merchant_customizations')
          .select('*')
          .eq('merchant_id', user.merchantId)
          .single();

        if (error) throw error;

        setCustomization(data);
      } catch (error) {
        console.error('Error fetching customization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomization();
  }, [user]);

  const handleSave = async () => {
    if (!customization || !user?.merchantId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('merchant_customizations')
        .upsert({
          merchant_id: user.merchantId,
          primary_color: customization.primary_color,
          secondary_color: customization.secondary_color,
          theme_color: customization.theme_color,
          font_family: customization.font_family,
          receipt_header: customization.receipt_header,
          receipt_footer: customization.receipt_footer,
          logo_url: customization.logo_url,
          custom_domain: customization.custom_domain,
          email_template: customization.email_template
        });

      if (error) throw error;

      toast({
        title: 'Saved',
        description: 'Your theme customization has been saved',
      });
    } catch (error) {
      console.error('Error saving customization:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your customization',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading customization settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Customization</CardTitle>
          <CardDescription>
            Customize the appearance of your merchant dashboard and customer-facing pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="colors">
            <TabsList className="mb-4">
              <TabsTrigger value="colors">Brand Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      className="w-12 h-10"
                      value={customization?.primary_color || '#000000'}
                      onChange={(e) => setCustomization(prev => prev ? ({
                        ...prev,
                        primary_color: e.target.value
                      }) : null)}
                    />
                    <Input
                      type="text"
                      value={customization?.primary_color || '#000000'}
                      onChange={(e) => setCustomization(prev => prev ? ({
                        ...prev,
                        primary_color: e.target.value
                      }) : null)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      className="w-12 h-10"
                      value={customization?.secondary_color || '#666666'}
                      onChange={(e) => setCustomization(prev => prev ? ({
                        ...prev,
                        secondary_color: e.target.value
                      }) : null)}
                    />
                    <Input
                      type="text"
                      value={customization?.secondary_color || '#666666'}
                      onChange={(e) => setCustomization(prev => prev ? ({
                        ...prev,
                        secondary_color: e.target.value
                      }) : null)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                  id="fontFamily"
                  value={customization?.font_family || 'Inter'}
                  onChange={(e) => setCustomization(prev => prev ? ({
                    ...prev,
                    font_family: e.target.value
                  }) : null)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="useCustomFonts" />
                <Label htmlFor="useCustomFonts">Enable custom font loading</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="receipts" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiptHeader">Receipt Header</Label>
                <Textarea
                  id="receiptHeader"
                  value={customization?.receipt_header || ''}
                  onChange={(e) => setCustomization(prev => prev ? ({
                    ...prev,
                    receipt_header: e.target.value
                  }) : null)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiptFooter">Receipt Footer</Label>
                <Textarea
                  id="receiptFooter"
                  value={customization?.receipt_footer || ''}
                  onChange={(e) => setCustomization(prev => prev ? ({
                    ...prev,
                    receipt_footer: e.target.value
                  }) : null)}
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} disabled={saving || !customization}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeCustomization;
