import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentIntegrationService } from '@/services/integrations/paymentIntegrationService';
import { PaymentIntegration } from '@/types/integrations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function usePaymentIntegrations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const merchantId = user?.merchantId;

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['payment-integrations', merchantId],
    queryFn: () => paymentIntegrationService.getIntegrations(merchantId!),
    enabled: !!merchantId
  });

  const createIntegration = useMutation({
    mutationFn: (newIntegration: Partial<PaymentIntegration>) => 
      paymentIntegrationService.createIntegration({ ...newIntegration, merchantId: merchantId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-integrations', merchantId] });
      toast({
        title: 'Integration Added',
        description: 'Payment integration has been added successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    integrations,
    isLoading,
    createIntegration
  };
}
