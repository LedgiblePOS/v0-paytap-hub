
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

// API Credentials Form Schema
export const apiCredentialsSchema = z.object({
  fasstapUsername: z.string().min(1, "Username is required").or(z.string().length(0)),
  fasstapPassword: z.string().min(1, "Password is required").or(z.string().length(0)),
  fasstapApiUrl: z.string().url("Must be a valid URL").or(z.string().length(0)),
  cbdcUsername: z.string().optional(),
  cbdcPassword: z.string().optional(),
  cbdcApiUrl: z.string().url("Must be a valid URL").or(z.string().length(0).or(z.string().optional())),
  useFasstapBridge: z.boolean().default(false),
  useCBDC: z.boolean().default(false),
  applePayEnabled: z.boolean().default(false),
  googlePayEnabled: z.boolean().default(false),
});

export type ApiCredentialsFormValues = z.infer<typeof apiCredentialsSchema>;

interface ApiCredentialsFormProps {
  initialValues: ApiCredentialsFormValues;
  onSubmit: (data: ApiCredentialsFormValues) => Promise<void>;
}

export const ApiCredentialsForm: React.FC<ApiCredentialsFormProps> = ({ 
  initialValues, 
  onSubmit 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<ApiCredentialsFormValues>({
    resolver: zodResolver(apiCredentialsSchema),
    defaultValues: {
      ...initialValues,
      applePayEnabled: initialValues.applePayEnabled || false,
      googlePayEnabled: initialValues.googlePayEnabled || false
    },
  });

  const handleSubmit = async (data: ApiCredentialsFormValues) => {
    setIsSaving(true);
    setFormError(null);
    try {
      await onSubmit(data);
    } catch (error: any) {
      setFormError(error.message || "Failed to save credentials");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {formError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="fasstap" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fasstap">Fasstap Settings</TabsTrigger>
            <TabsTrigger value="cbdc">CBDC Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fasstap" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fasstap API Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fasstapUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Fasstap Username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your Fasstap account username
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fasstapPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Fasstap Password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your Fasstap account password
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="fasstapApiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://api.fasstap.com/v1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave blank to use the default Fasstap API endpoint
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="useFasstapBridge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Use Fasstap Bridge</FormLabel>
                        <FormDescription>
                          Enable to use the Fasstap Bridge for direct device communication
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSaving}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4">
                  <h4 className="text-base font-medium mb-3">Digital Wallet Support</h4>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="applePayEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Apple Pay</FormLabel>
                            <FormDescription>
                              Allow customers to pay using Apple Pay
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSaving}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="googlePayEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Google Pay</FormLabel>
                            <FormDescription>
                              Allow customers to pay using Google Pay
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSaving}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="cbdc" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">CBDC API Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cbdcUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="CBDC Username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your CBDC account username
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cbdcPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="CBDC Password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your CBDC account password
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="cbdcApiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://api.emtech-cbdc.com/v1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave blank to use the default CBDC API endpoint
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="useCBDC"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Use CBDC</FormLabel>
                        <FormDescription>
                          Enable to accept payments via Central Bank Digital Currency
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSaving}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Credentials
          </Button>
        </div>
      </form>
    </Form>
  );
};
