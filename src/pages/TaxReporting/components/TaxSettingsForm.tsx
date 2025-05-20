
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaxSettings, TaxSettingsFormValues } from "../hooks/useTaxSettings";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

// Create a form schema for tax settings
const taxSettingsSchema = z.object({
  salesTaxRate: z.coerce.number().min(0).max(100),
  stateTaxRate: z.coerce.number().min(0).max(100),
  localTaxRate: z.coerce.number().min(0).max(100),
  applyTaxToAllProducts: z.boolean().default(true),
});

const TaxSettingsForm: React.FC = () => {
  const { user } = useAuth();
  const { defaultValues, isLoading, onSubmit } = useTaxSettings();
  
  // Initialize form with default values
  const form = useForm<TaxSettingsFormValues>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues,
  });

  const handleSubmit = async (data: TaxSettingsFormValues) => {
    await onSubmit(data);
  };
  
  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please log in to configure tax settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="salesTaxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  General sales tax rate applied to transactions
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
                  <Input type="number" step="0.1" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  State-specific tax rate
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
                  <Input type="number" step="0.1" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  City or county specific tax rate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="applyTaxToAllProducts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Apply tax to all products</FormLabel>
                <FormDescription>
                  When enabled, these tax rates will apply to all products. Disable to configure taxes per product.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TaxSettingsForm;
