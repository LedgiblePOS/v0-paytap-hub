
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MerchantFormValues } from "./MerchantFormSchema";

interface ApiCredentialsSectionProps {
  form: UseFormReturn<MerchantFormValues>;
  isLoading: boolean;
}

const ApiCredentialsSection: React.FC<ApiCredentialsSectionProps> = ({
  form,
  isLoading,
}) => {
  const enableFasstap = form.watch("apiCredentials.enableFasstap") || false;
  const enableCBDC = form.watch("apiCredentials.enableCBDC") || false;
  const enableLynk = form.watch("apiCredentials.enableLynk") || false;
  const enableWiPay = form.watch("apiCredentials.enableWiPay") || false;

  return (
    <Accordion type="single" collapsible className="w-full mt-6 border rounded-md">
      <AccordionItem value="api-credentials">
        <AccordionTrigger className="px-4 hover:no-underline">
          <span className="text-base font-medium">Payment API Credentials (Optional)</span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              You can optionally set up your payment API credentials now, or do it later in the settings.
            </p>
            
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-base">Fasstap Credentials</h4>
                <FormField
                  control={form.control}
                  name="apiCredentials.enableFasstap"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormLabel className="text-sm mr-2">Enable Fasstap</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || enableCBDC}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!enableFasstap ? 'opacity-50' : ''}`}>
                <FormField
                  control={form.control}
                  name="apiCredentials.fasstapUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Username {enableFasstap && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Fasstap API username" 
                          {...field} 
                          disabled={isLoading || !enableFasstap} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiCredentials.fasstapPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Password {enableFasstap && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter Fasstap API password" 
                          {...field} 
                          disabled={isLoading || !enableFasstap}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiCredentials.fasstapApiUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>API URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://api.fasstap.com/v1" 
                          {...field} 
                          disabled={isLoading || !enableFasstap}
                        />
                      </FormControl>
                      <FormDescription>
                        The base URL for Fasstap API calls
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-base">CBDC Credentials</h4>
                <FormField
                  control={form.control}
                  name="apiCredentials.enableCBDC"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormLabel className="text-sm mr-2">Enable CBDC</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || enableFasstap}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!enableCBDC ? 'opacity-50' : ''}`}>
                <FormField
                  control={form.control}
                  name="apiCredentials.cbdcUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Username {enableCBDC && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter CBDC API username" 
                          {...field} 
                          disabled={isLoading || !enableCBDC} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiCredentials.cbdcPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Password {enableCBDC && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter CBDC API password" 
                          {...field} 
                          disabled={isLoading || !enableCBDC}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiCredentials.cbdcApiUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>API URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://api.emtech-cbdc.com/v1" 
                          {...field}
                          disabled={isLoading || !enableCBDC}
                        />
                      </FormControl>
                      <FormDescription>
                        The base URL for CBDC API calls
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-base">Lynk Business API Credentials</h4>
                <FormField
                  control={form.control}
                  name="apiCredentials.enableLynk"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormLabel className="text-sm mr-2">Enable Lynk API</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!enableLynk ? 'opacity-50' : ''}`}>
                <FormField
                  control={form.control}
                  name="apiCredentials.lynkClientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID {enableLynk && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Lynk client ID" 
                          {...field} 
                          disabled={isLoading || !enableLynk}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiCredentials.lynkClientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret {enableLynk && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Enter Lynk client secret" 
                          {...field} 
                          disabled={isLoading || !enableLynk}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiCredentials.lynkAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account ID {enableLynk && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Lynk Account ID"
                          {...field}
                          disabled={isLoading || !enableLynk}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiCredentials.lynkApiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://non-prod-api.lynk.us/online_payments/beta_1"
                          {...field}
                          disabled={isLoading || !enableLynk}
                        />
                      </FormControl>
                      <FormDescription>
                        The Lynk API base URL, if custom
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiCredentials.lynkNotificationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://yourapp.com/lynk-webhook"
                          {...field}
                          disabled={isLoading || !enableLynk}
                        />
                      </FormControl>
                      <FormDescription>
                        Your webhook endpoint to receive Lynk payment status notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-base">WiPay API Credentials</h4>
                <FormField
                  control={form.control}
                  name="apiCredentials.enableWiPay"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormLabel className="text-sm mr-2">Enable WiPay</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!enableWiPay ? 'opacity-50' : ''}`}>
                <FormField
                  control={form.control}
                  name="apiCredentials.wipayUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username {enableWiPay && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter WiPay username" 
                          {...field} 
                          disabled={isLoading || !enableWiPay}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiCredentials.wipayPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password {enableWiPay && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Enter WiPay password" 
                          {...field} 
                          disabled={isLoading || !enableWiPay}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiCredentials.wipayApiUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>API URL {enableWiPay && <span className="text-red-500">*</span>}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://api.wipaycaribbean.com/v1"
                          {...field}
                          disabled={isLoading || !enableWiPay}
                        />
                      </FormControl>
                      <FormDescription>
                        The WiPay API base URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ApiCredentialsSection;
