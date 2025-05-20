import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '@/services/reports/reportsService';
import { Report } from '@/types/reports';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useReports() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const merchantId = user?.merchantId;

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', merchantId],
    queryFn: () => reportsService.fetchReports(merchantId!),
    enabled: !!merchantId
  });

  const createReport = useMutation({
    mutationFn: (newReport: Partial<Report>) => 
      reportsService.createReport({ ...newReport, merchantId: merchantId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', merchantId] });
      toast({
        title: 'Report Created',
        description: 'Your report has been created successfully'
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
    reports,
    isLoading,
    createReport
  };
}
