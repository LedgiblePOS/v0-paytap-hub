
import React from 'react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

const PaymentSettingsTab = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    toast({
      title: "Settings Saved",
      description: "Your payment settings have been updated."
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>
          Configure your payment processing settings and credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="gateway">Payment Gateway</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Input 
                    id="defaultCurrency"
                    {...register("defaultCurrency", { required: true })}
                    defaultValue="USD"
                    className="max-w-xs"
                  />
                  {errors.defaultCurrency && (
                    <p className="text-sm text-red-500 mt-1">Default currency is required</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="transactionPrefix">Transaction ID Prefix</Label>
                  <Input 
                    id="transactionPrefix"
                    {...register("transactionPrefix")}
                    placeholder="TXN-"
                    className="max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional prefix for your transaction IDs
                  </p>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto-capture payments</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically capture authorized payments
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">Receipt emails</h4>
                    <p className="text-sm text-muted-foreground">
                      Send receipt emails to customers after purchase
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>

              <Button type="submit">Save Settings</Button>
            </form>
          </TabsContent>

          <TabsContent value="gateway">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Gateway Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your payment gateway credentials
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input 
                    id="apiKey"
                    type="password" 
                    placeholder="Enter your API key"
                    className="max-w-lg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input 
                    id="secretKey"
                    type="password" 
                    placeholder="Enter your secret key"
                    className="max-w-lg"
                  />
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">Test Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Process transactions in test mode without real charges
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button variant="secondary">Verify Credentials</Button>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure payment security settings
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">3D Secure</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable 3D Secure authentication for credit card transactions
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">CVV Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Require CVV code for all credit card transactions
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">Fraud Detection</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically flag suspicious transactions
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-6">
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button onClick={() => {
          toast({
            title: "Settings Saved",
            description: "Your payment settings have been updated."
          });
        }}>Save All Settings</Button>
      </CardFooter>
    </>
  );
};

export default PaymentSettingsTab;
