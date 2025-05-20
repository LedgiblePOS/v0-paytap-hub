
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import SettingsLayout from './components/SettingsLayout';
import { useTaxSettings, TaxSettingsFormValues } from '@/pages/TaxReporting/hooks/useTaxSettings';
import TaxJurisdictionSelector from './components/TaxJurisdictionSelector';
import TaxDocumentationHelper from './components/TaxDocumentationHelper';
import { getJurisdictionById } from '@/services/tax/taxJurisdictions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Tax Settings Form Schema
const taxSettingsSchema = z.object({
  jurisdictionId: z.string().optional(),
  salesTaxRate: z.coerce.number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%'),
  stateTaxRate: z.coerce.number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%'),
  localTaxRate: z.coerce.number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%'),
  applyTaxToAllProducts: z.boolean().default(true),
});

const TaxSettings: React.FC = () => {
  const { defaultValues, isLoading, onSubmit, handleJurisdictionSelect } = useTaxSettings();
  const [activeTab, setActiveTab] = React.useState("settings");

  const form = useForm<TaxSettingsFormValues>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = (data: TaxSettingsFormValues) => {
    onSubmit(data);
  };

  const selectedJurisdictionId = form.watch('jurisdictionId');

  const handleJurisdictionChange = (jurisdictionId: string) => {
    const jurisdiction = getJurisdictionById(jurisdictionId);
    if (jurisdiction) {
      form.setValue('jurisdictionId', jurisdiction.id);
      if (jurisdiction.id !== 'custom') {
        form.setValue('salesTaxRate', jurisdiction.salesTaxRate);
        form.setValue('stateTaxRate', jurisdiction.stateTaxRate);
        form.setValue('localTaxRate', jurisdiction.localTaxRate);
      }
    }
  };

  if (isLoading) {
    return (
      <SettingsLayout title="Tax Settings">
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout 
      title="Tax Settings" 
      description="Configure tax rates and settings for your business"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="settings">Tax Configuration</TabsTrigger>
          <TabsTrigger value="help">Documentation & Help</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Alert className="bg-primary/5 border-primary/20">
                  <AlertDescription>
                    Select a tax jurisdiction to automatically apply common tax rates, or use custom rates for your specific location.
                  </AlertDescription>
                </Alert>

                <FormField
                  control={form.control}
                  name="jurisdictionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Jurisdiction</FormLabel>
                      <FormControl>
                        <TaxJurisdictionSelector 
                          value={field.value || 'custom'} 
                          onSelect={(jurisdiction) => {
                            handleJurisdictionChange(jurisdiction.id);
                          }} 
                        />
                      </FormControl>
                      <FormDescription>
                        Select your business location or "Custom" to set your own rates
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salesTaxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          disabled={selectedJurisdictionId !== 'custom' && isLoading}
                          className={selectedJurisdictionId !== 'custom' ? 'bg-muted' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Combined tax rate applied to taxable sales
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stateTaxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          disabled={selectedJurisdictionId !== 'custom' && isLoading}
                          className={selectedJurisdictionId !== 'custom' ? 'bg-muted' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        State portion of the tax rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localTaxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          disabled={selectedJurisdictionId !== 'custom' && isLoading}
                          className={selectedJurisdictionId !== 'custom' ? 'bg-muted' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Local/city portion of the tax rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applyTaxToAllProducts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Apply Tax to All Products
                        </FormLabel>
                        <FormDescription>
                          When disabled, tax rates will only apply to products marked as taxable
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="help">
          <TaxDocumentationHelper />
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
};

export default TaxSettings;
