
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FACApiForm } from './FACApiForm';
import { FACDocumentation } from './FACDocumentation';
import { FACLoadedAlert } from './FACLoadedAlert';
import { usePaymentIntegration } from './hooks/usePaymentIntegration';

export const FirstAtlanticCommerceSettings: React.FC = () => {
  const {
    credentials,
    setCredentials,
    isSaving,
    credentialsLoaded,
    handleInputChange,
    saveCredentials
  } = usePaymentIntegration();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Payment Gateway Settings</h2>
        <p className="text-muted-foreground">
          Configure payment gateway integration for merchant subscriptions and payments.
        </p>
      </div>

      <Tabs defaultValue="first-atlantic">
        <TabsList className="mb-4">
          <TabsTrigger value="first-atlantic">First Atlantic Commerce</TabsTrigger>
          <TabsTrigger value="other" disabled>Other Providers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="first-atlantic" className="space-y-6">
          <FACLoadedAlert credentialsLoaded={credentialsLoaded} />
          
          <Card>
            <CardHeader>
              <CardTitle>First Atlantic Commerce Integration</CardTitle>
              <CardDescription>
                Configure First Atlantic Commerce API credentials for processing subscription payments.
              </CardDescription>
            </CardHeader>
            <FACApiForm
              credentials={credentials}
              handleInputChange={handleInputChange}
              saveCredentials={saveCredentials}
              isSaving={isSaving}
            />
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Integration Documentation</CardTitle>
              <CardDescription>
                Reference information for First Atlantic Commerce integration.
              </CardDescription>
            </CardHeader>
            <FACDocumentation />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
