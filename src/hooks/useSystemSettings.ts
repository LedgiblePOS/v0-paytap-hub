
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemSettingsService } from '@/services/settings';
import { SystemSettings } from '@/types/settings';
import { useToast } from './use-toast';

export function useSystemSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Query for fetching system settings
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: systemSettingsService.getSystemSettings,
  });
  
  // Mutation for updating system settings
  const updateSettings = useMutation({
    mutationFn: (updatedSettings: SystemSettings) => {
      setIsSubmitting(true);
      return systemSettingsService.updateSystemSettings(updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      toast({
        title: 'Settings updated',
        description: 'System settings have been updated successfully',
      });
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update settings: ${error.message}`,
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
