
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Smartphone } from 'lucide-react';
import { ApiCredentialsForm } from './components/ApiCredentialsForm';
import SettingsLayout from './components/SettingsLayout';
import credentialsManager from '@/services/checkout/credentialsManager';
import settingsManager from '@/services/checkout/settingsManager';
import bridgeService from '@/services/checkout/bridgeService';
import { FasstapService } from '@/services/fasstapService';
import { supabase } from '@/integrations/supabase/client';

// Connection status type
type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

interface ConnectionState {
  fasstap: ConnectionStatus;
  cbdc: ConnectionStatus;
  fasstapMessage?: string;
  cbdcMessage?: string;
}

const ApiCredentials: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState({
    fasstapUsername: '',
    fasstapPassword: '',
    fasstapApiUrl: '',
    cbdcUsername: '',
    cbdcPassword: '',
    cbdcApiUrl: '',
    useFasstapBridge: false,
    useCBDC: false,
    applePayEnabled: false,
    googlePayEnabled: false
  });
  
  const [connectedDevices, setConnectedDevices] = useState<Array<{ id: string, last_ping: string }>>([]);
  
  // Connection status state
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    fasstap: 'idle',
    cbdc: 'idle'
  });

  // Load credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const merchantId = user.id;
        
        // Load API credentials
        const savedCredentials = await credentialsManager.loadCredentials(merchantId);
        if (savedCredentials) {
          setCredentials({
            fasstapUsername: savedCredentials.fasstap_username || '',
            fasstapPassword: savedCredentials.fasstap_password || '',
            fasstapApiUrl: savedCredentials.fasstap_api_url || '',
            cbdcUsername: savedCredentials.cbdc_username || '',
            cbdcPassword: savedCredentials.cbdc_password || '',
            cbdcApiUrl: savedCredentials.cbdc_api_url || '',
            useFasstapBridge: savedCredentials.use_fasstap_bridge || false,
            useCBDC: savedCredentials.use_cbdc || false,
            applePayEnabled: savedCredentials.apple_pay_enabled || false,
            googlePayEnabled: savedCredentials.google_pay_enabled || false
          });
        }
        
        // Load settings
        await settingsManager.loadSettings(merchantId);
        
        // Load connected devices
        await loadConnectedDevices(merchantId);
      } catch (error) {
        console.error('Failed to load credentials:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load API credentials"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCredentials();
  }, [user, toast]);

  const loadConnectedDevices = async (merchantId: string) => {
    try {
      const { data: wallets, error } = await supabase
        .from('merchant_wallets')
        .select('device_id, status, last_ping')
        .eq('merchant_id', merchantId)
        .eq('status', 'active')
        .order('last_ping', { ascending: false });
      
      if (error) throw error;
      
      if (wallets) {
        // Filter devices that have been active in the last hour
        const activeDevices = wallets.filter(device => {
          const lastPing = new Date(device.last_ping);
          const now = new Date();
          const hoursSinceLastPing = (now.getTime() - lastPing.getTime()) / (1000 * 60 * 60);
          return hoursSinceLastPing < 1;
        });
        
        setConnectedDevices(activeDevices);
      }
    } catch (error) {
      console.error('Failed to load connected devices:', error);
    }
  };

  const handleSaveCredentials = async (formData: any) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save credentials"
      });
      return;
    }
    
    try {
      const success = await credentialsManager.saveCredentials({
        merchantId: user.id,
        ...formData
      });
      
      if (success) {
        toast({
          title: "Credentials Saved",
          description: "API credentials have been updated successfully"
        });
        
        // Reset connection status after save
        setConnectionState({
          fasstap: 'idle',
          cbdc: 'idle'
        });
        
        // Load connected devices after saving
        await loadConnectedDevices(user.id);
      } else {
        throw new Error("Failed to save credentials");
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save credentials. Please try again."
      });
    }
  };

  // Test API connection
  const testConnection = async (api: 'fasstap' | 'cbdc') => {
    if (!user?.id) return;
    
    // Update state to show testing
    setConnectionState(prev => ({
      ...prev,
      [api]: 'testing'
    }));

    try {
      // Validate credentials first
      if (api === 'fasstap' && (!credentials.fasstapUsername || !credentials.fasstapPassword)) {
        throw new Error("Fasstap credentials are incomplete");
      }
      
      if (api === 'cbdc' && (!credentials.cbdcUsername || !credentials.cbdcPassword)) {
        throw new Error("CBDC credentials are incomplete");
      }
      
      // Test connection using the proxy endpoints
      if (api === 'fasstap') {
        // Check if a device is connected
        const isConnected = await bridgeService.checkDeviceConnection(user.id);
        
        if (!isConnected) {
          throw new Error("No Fasstap devices connected. Please make sure your mobile device with Fasstap is online.");
        }
        
        // Test a connection using the Edge Function
        const { data, error } = await supabase.functions.invoke('fasstap-proxy', {
          body: {
            merchantId: user.id,
            endpoint: 'status',
            data: {}
          }
        });
        
        if (error || !data.success) {
          throw error || new Error("Failed to connect to Fasstap API");
        }
      } else {
        // Test CBDC connection
        const { data, error } = await supabase.functions.invoke('cbdc-proxy', {
          body: {
            merchantId: user.id,
            endpoint: 'status',
            data: {}
          }
        });
        
        if (error || !data.success) {
          throw error || new Error("Failed to connect to CBDC API");
        }
      }
      
      // Success!
      setConnectionState(prev => ({
        ...prev,
        [api]: 'success',
        [`${api}Message`]: `Successfully connected to ${api.toUpperCase()} API`
      }));
      
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${api.toUpperCase()} API`
      });
    } catch (error: any) {
      setConnectionState(prev => ({
        ...prev,
        [api]: 'error',
        [`${api}Message`]: error.message
      }));
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message
      });
    }
  };

  const checkDigitalWalletSupport = async () => {
    if (!user?.id) return;
    
    try {
      const fasstapService = FasstapService.getInstance();
      fasstapService.setMerchantId(user.id);
      
      const applePayAvailable = fasstapService.isApplePayAvailable();
      const googlePayAvailable = fasstapService.isGooglePayAvailable();
      
      toast({
        title: "Digital Wallet Support",
        description: `Apple Pay: ${applePayAvailable ? 'Available' : 'Not Available'}, Google Pay: ${googlePayAvailable ? 'Available' : 'Not Available'}`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Check Digital Wallet Support",
        description: error.message
      });
    }
  };

  // Render connection status indicator
  const renderConnectionStatus = (status: ConnectionStatus, message?: string) => {
    switch (status) {
      case 'testing':
        return (
          <div className="flex items-center text-blue-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Testing connection...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>{message || 'Connection successful'}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-500">
            <XCircle className="mr-2 h-4 w-4" />
            <span>{message || 'Connection failed'}</span>
          </div>
        );
      case 'idle':
      default:
        return credentials.fasstapUsername || credentials.cbdcUsername ? (
          <div className="flex items-center text-yellow-500">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Connection not tested</span>
          </div>
        ) : null;
    }
  };

  if (isLoading) {
    return (
      <SettingsLayout title="API Credentials">
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout 
      title="API Credentials" 
      description="Manage your API keys and connection settings for payment processing"
    >
      <div className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            Enter your API credentials for each service to enable payment processing. Connected devices will automatically register with your account.
          </AlertDescription>
        </Alert>

        {connectedDevices.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 className="flex items-center text-green-700 font-medium mb-2">
              <Smartphone className="h-4 w-4 mr-2" />
              Connected Devices
            </h3>
            <ul className="space-y-1 text-sm">
              {connectedDevices.map((device, index) => (
                <li key={index} className="text-green-600">
                  Device ID: {device.id.substring(0, 10)}...
                  <span className="ml-2 text-green-500">
                    (Last active: {new Date(device.last_ping).toLocaleTimeString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ApiCredentialsForm 
          initialValues={credentials}
          onSubmit={handleSaveCredentials}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Fasstap Connection Status */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Fasstap API Connection</h3>
            {renderConnectionStatus(connectionState.fasstap, connectionState.fasstapMessage)}
            <div className="flex space-x-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={!credentials.fasstapUsername || !credentials.fasstapPassword || connectionState.fasstap === 'testing'}
                onClick={() => testConnection('fasstap')}
              >
                {connectionState.fasstap === 'testing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={checkDigitalWalletSupport}
              >
                Check Wallet Support
              </Button>
            </div>
          </div>

          {/* CBDC Connection Status */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">CBDC API Connection</h3>
            {renderConnectionStatus(connectionState.cbdc, connectionState.cbdcMessage)}
            <Button 
              className="mt-2" 
              variant="outline" 
              size="sm"
              disabled={!credentials.cbdcUsername || !credentials.cbdcPassword || connectionState.cbdc === 'testing'}
              onClick={() => testConnection('cbdc')}
            >
              {connectionState.cbdc === 'testing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default ApiCredentials;
