
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Key, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import ErrorDisplay from '@/components/Layout/ErrorDisplay';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
}

const ApiCredentials = () => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const {
    data: apiKeys,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      // Simulated API call - in production this would fetch from Supabase
      // const { data, error } = await supabase.from('api_keys').select('*').eq('user_id', user.id);
      // if (error) throw error;
      // return data as ApiKey[];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: '1',
          name: 'Production API Key',
          key: 'sk_prod_2zYNTftDgRe8VxL5TuSM9qKp',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Development API Key',
          key: 'sk_dev_8xWQsFcNgT3jLm7PvA5Z6rYd',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ] as ApiKey[];
    }
  });

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: `${keyName} has been copied to your clipboard.`,
      });
    }).catch(err => {
      toast({
        title: 'Copy failed',
        description: 'Could not copy key to clipboard.',
        variant: 'destructive'
      });
      console.error('Copy failed:', err);
    });
  };

  const generateNewKey = () => {
    toast({
      title: 'Feature not implemented',
      description: 'Key generation will be available in production.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading API credentials...</p>
        <p className="text-sm text-muted-foreground">Please wait while we retrieve your keys</p>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Error Loading API Credentials"
        message={error instanceof Error ? error.message : "Failed to load API credentials"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Credentials</h1>
          <p className="text-muted-foreground">
            Manage your API keys for integrating with external services.
          </p>
        </div>
        <Button onClick={generateNewKey}>
          <Key className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>

      <div className="grid gap-4">
        {apiKeys && apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader className="pb-3">
              <CardTitle>{apiKey.name}</CardTitle>
              <CardDescription>
                Created on {new Date(apiKey.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="font-mono bg-muted p-2 rounded flex-1 flex items-center">
                  <span className="truncate">
                    {showKeys[apiKey.id] ? apiKey.key : '•'.repeat(24)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                >
                  {showKeys[apiKey.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiCredentials;
