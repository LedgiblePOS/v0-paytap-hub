
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { downloadTaxReportCSV } from "@/services/tax/taxReportService";

export interface TaxReport {
  id: string;
  title: string;
  generatedDate: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  month?: number;
  quarter?: number;
  totalRevenue: number;
  salesTax: number;
  stateTax: number;
  localTax: number;
  totalTax: number;
}

export const useTaxReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<TaxReport[]>([]);
  
  // Fetch reports from the database (or use mock data)
  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      
      try {
        // In a real app, we would fetch from the database
        // For now, use mock data
        const mockReports: TaxReport[] = [
          {
            id: '1',
            title: 'Q1 2024 Tax Report',
            generatedDate: 'April 10, 2024',
            period: 'quarterly',
            year: 2024,
            quarter: 0,
            totalRevenue: 45750.00,
            salesTax: 3431.25,
            stateTax: 1830.00,
            localTax: 915.00,
            totalTax: 6176.25
          },
          {
            id: '2',
            title: 'March 2024 Tax Report',
            generatedDate: 'April 1, 2024',
            period: 'monthly',
            year: 2024,
            month: 2,
            totalRevenue: 18250.00,
            salesTax: 1368.75,
            stateTax: 730.00,
            localTax: 365.00,
            totalTax: 2463.75
          },
          {
            id: '3',
            title: 'February 2024 Tax Report',
            generatedDate: 'March 1, 2024',
            period: 'monthly',
            year: 2024,
            month: 1,
            totalRevenue: 15500.00,
            salesTax: 1162.50,
            stateTax: 620.00,
            localTax: 310.00,
            totalTax: 2092.50
          },
          {
            id: '4',
            title: 'January 2024 Tax Report',
            generatedDate: 'February 1, 2024',
            period: 'monthly',
            year: 2024,
            month: 0,
            totalRevenue: 12000.00,
            salesTax: 900.00,
            stateTax: 480.00,
            localTax: 240.00,
            totalTax: 1620.00
          }
        ];
        
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching tax reports:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tax reports",
          variant: "destructive"
        });
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [user, toast]);

  const downloadReport = useCallback((reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) {
      toast({
        title: "Error",
        description: "Report not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Convert to the format expected by downloadTaxReportCSV
      const reportData = {
        id: report.id,
        title: report.title,
        period: report.period,
        year: report.year,
        quarter: report.quarter,
        month: report.month,
        totalRevenue: report.totalRevenue,
        salesTax: report.salesTax,
        stateTax: report.stateTax,
        localTax: report.localTax,
        totalTax: report.totalTax,
        generatedDate: new Date().toISOString()
      };
      
      downloadTaxReportCSV(reportData);
      
      toast({
        title: "Report Downloaded",
        description: `${report.title} has been downloaded.`,
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive"
      });
    }
  }, [reports, toast]);

  return {
    reports,
    isLoading,
    downloadReport
  };
};
