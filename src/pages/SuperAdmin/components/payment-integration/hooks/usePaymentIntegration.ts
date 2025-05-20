
import { useState, useEffect } from 'react';
import { FACCredentials } from '../types';
import systemSettingsService from '@/services/systemSettingsService';
import { toast } from '@/components/ui/use-toast';

// Define explicit types to prevent deep instantiation
interface PaymentConfig {
  merchantId: string;
  apiKey: string;
  environment: 'sandbox' | 'production';
  enabled: boolean;
}

export const usePaymentIntegration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  
  // Define credentials state with proper typing
  const [credentials, setCredentials] = useState<FACCredentials>({
    merchantId: '',
    apiKey: '',
    apiUrl: '',
    testMode: true
  });
  
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);

  // Mock API call to fetch configuration
  const fetchPaymentSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, fetch from API or database
      const savedCredentials = localStorage.getItem('fac_credentials');
      
      if (savedCredentials) {
        const parsedCredentials = JSON.parse(savedCredentials);
        setCredentials(parsedCredentials);
        setCredentialsLoaded(true);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching payment settings:', err);
      setError('Failed to load payment settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setCredentials(prev => ({
      ...prev,
      [name]: inputValue
    }));
  };

  // Save credentials
  const saveCredentials = async () => {
    try {
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, save to API or database
      localStorage.setItem('fac_credentials', JSON.stringify(credentials));
      setCredentialsLoaded(true);
      
      toast({
        title: "Settings saved",
        description: "Payment gateway credentials updated successfully."
      });
      
      return;
    } catch (err) {
      console.error('Error saving payment credentials:', err);
      toast({
        title: "Error",
        description: "Failed to save payment gateway credentials.",
        variant: "destructive"
      });
      setError('Failed to save payment credentials');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  return {
    isLoading,
    isSaving,
    error,
    settings,
    credentials,
    setCredentials,
    credentialsLoaded,
    handleInputChange,
    saveCredentials,
    refreshSettings: fetchPaymentSettings
  };
};
