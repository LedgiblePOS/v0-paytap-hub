
import { useState, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { generateTaxReport, downloadTaxReportCSV } from "@/services/tax/taxReportService";

export const useTaxReporting = () => {
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleDownloadReport = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to download reports",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Get the current year and month/quarter
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      
      // Generate the appropriate report based on the selected period
      const report = await generateTaxReport(
        user.id,
        period,
        currentYear,
        period === 'quarterly' ? currentQuarter : undefined,
        period === 'monthly' ? currentMonth : undefined
      );
      
      if (!report) {
        throw new Error("Failed to generate report");
      }
      
      // Download the report as CSV
      downloadTaxReportCSV(report);
      
      toast({
        title: "Report Downloaded",
        description: `Your ${period} tax report has been downloaded.`,
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: `Failed to download report: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [period, user, toast]);
  
  return {
    period,
    setPeriod,
    isGenerating,
    handleDownloadReport
  };
};
