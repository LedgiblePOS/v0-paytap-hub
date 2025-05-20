
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FACCredentials } from './types';

interface FACApiFormProps {
  credentials: FACCredentials;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveCredentials: () => Promise<void>;
  isSaving: boolean;
}

export const FACApiForm: React.FC<FACApiFormProps> = ({
  credentials,
  handleInputChange,
  saveCredentials,
  isSaving
}) => {
  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="merchantId">Merchant ID</Label>
        <Input
          id="merchantId"
          name="merchantId"
          value={credentials.merchantId}
          onChange={handleInputChange}
          placeholder="Enter your FAC Merchant ID"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          value={credentials.apiKey}
          onChange={handleInputChange}
          placeholder="Enter your FAC API Key"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="apiUrl">API URL</Label>
        <Input
          id="apiUrl"
          name="apiUrl"
          value={credentials.apiUrl}
          onChange={handleInputChange}
          placeholder="https://api.firstatlanticcommerce.com/PGServiceV2"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="testMode"
          name="testMode"
          checked={credentials.testMode}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: 'testMode',
                type: 'checkbox',
                checked
              }
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(event);
          }}
        />
        <Label htmlFor="testMode">Test Mode</Label>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={saveCredentials} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Credentials'}
        </Button>
      </div>
    </CardContent>
  );
};
