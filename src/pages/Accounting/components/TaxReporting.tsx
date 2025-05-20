import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { generateReport } from '@/services/accounting/reportingService';
import { useAuth } from '@/hooks/useAuth';

interface TaxReportingProps {
  merchantId: string;
}

export function TaxReporting({ merchantId }: TaxReportingProps) {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
    
      // Using generateReport instead of generateTaxReport
      const reportUrl = await generateReport({
        merchantId: user?.merchantId || '',
        startDate: dateRange.from,
        endDate: dateRange.to,
        type: 'tax'
      });
    
      setReportUrl(reportUrl);
      toast({
        title: 'Tax Report Generated',
        description: 'Your tax report has been successfully generated.',
      });
    } catch (error) {
      console.error('Failed to generate tax report:', error);
      toast({
        title: 'Report Generation Failed',
        description: 'There was an error generating your tax report. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tax Reporting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateRangePicker onDateChange={setDateRange} date={dateRange} />
        <Button onClick={handleGenerateReport} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Tax Report'}
        </Button>
        {reportUrl && (
          <a href={reportUrl} target="_blank" rel="noopener noreferrer">
            View Tax Report
          </a>
        )}
      </CardContent>
    </Card>
  );
}
