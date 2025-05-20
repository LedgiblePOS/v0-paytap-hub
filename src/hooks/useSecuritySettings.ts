
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { securitySettingsService } from '@/services/settings';
import { SecuritySettings } from '@/types/settings';
import { useToast } from './use-toast';

export function useSecuritySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Query for fetching security settings
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['securitySettings'],
    queryFn: securitySettingsService.getSecuritySettings,
  });
  
  // Mutation for updating security settings
  const updateSettings = useMutation({
    mutationFn: (updatedSettings: SecuritySettings) => {
      setIsSubmitting(true);
      return securitySettingsService.updateSecuritySettings(updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securitySettings'] });
      toast({
        title: 'Security settings updated',
        description: 'Security settings have been updated successfully',
      });
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update security settings: ${error.message}`,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    },
  });
  
  return {
    settings,
    isLoading,
    error,
    refetch,
    updateSettings: updateSettings.mutate,
    isSubmitting,
  };
}
