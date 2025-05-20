
import { supabase } from "@/integrations/supabase/client";
import { taxCalculator } from "@/services/tax/taxCalculator";
import { getTaxSettings, getDefaultTaxSettings } from "@/services/tax/taxSettingsService";

export interface TaxReportData {
  id: string;
  title: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  quarter?: number;
  month?: number;
  totalRevenue: number;
  salesTax: number;
  stateTax: number;
  localTax: number;
  totalTax: number;
  generatedDate: string;
}

/**
 * Generate a tax report for a specific period
 */
export const generateTaxReport = async (
  merchantId: string,
  period: 'monthly' | 'quarterly' | 'yearly',
  year: number,
  quarter?: number,
  month?: number
): Promise<TaxReportData | null> => {
  try {
    // Get tax settings
    const taxSettings = await getTaxSettings(merchantId) || 
      getDefaultTaxSettings(merchantId);
    
    // Define date range based on period
    let startDate: Date, endDate: Date, periodTitle: string;
    
    if (period === 'monthly' && month !== undefined) {
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];
      periodTitle = `${monthNames[month]} ${year}`;
    } else if (period === 'quarterly' && quarter !== undefined) {
      const startMonth = quarter * 3;
      startDate = new Date(year, startMonth, 1);
      endDate = new Date(year, startMonth + 3, 0);
      periodTitle = `Q${quarter + 1} ${year}`;
    } else {
      // Yearly
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
      periodTitle = `Annual ${year}`;
    }
    
    // Calculate taxes
    const calculationResult = await taxCalculator.calculateTaxes(
      merchantId,
      startDate,
      endDate,
      taxSettings.salesTaxRate / 100
    );
    
    // Calculate different tax components
    const totalRevenue = calculationResult.totalSales;
    const salesTaxAmount = totalRevenue * (taxSettings.salesTaxRate / 100);
    const stateTaxAmount = totalRevenue * (taxSettings.stateTaxRate / 100);
    const localTaxAmount = totalRevenue * (taxSettings.localTaxRate / 100);
    const totalTaxAmount = salesTaxAmount + stateTaxAmount + localTaxAmount;
    
    // Create a unique ID for the report
    const reportId = crypto.randomUUID();
    
    // Return the report data
    const reportData: TaxReportData = {
      id: reportId,
      title: `${periodTitle} Tax Report`,
      period,
      year,
      quarter,
      month,
      totalRevenue,
      salesTax: salesTaxAmount,
      stateTax: stateTaxAmount,
      localTax: localTaxAmount,
      totalTax: totalTaxAmount,
      generatedDate: new Date().toISOString()
    };
    
    // In a real app, we would save this to the database
    // For now, just return the data
    return reportData;
  } catch (error) {
    console.error("Error generating tax report:", error);
    return null;
  }
};

/**
 * Generate a CSV file from tax report data
 */
export const generateTaxReportCSV = (report: TaxReportData): string => {
  const headers = [
    'Report ID',
    'Title',
    'Period',
    'Total Revenue',
    'Sales Tax',
    'State Tax',
    'Local Tax',
    'Total Tax',
    'Generated Date'
  ];
  
  const values = [
    report.id,
    report.title,
    report.period,
    report.totalRevenue.toFixed(2),
    report.salesTax.toFixed(2),
    report.stateTax.toFixed(2),
    report.localTax.toFixed(2),
    report.totalTax.toFixed(2),
    new Date(report.generatedDate).toLocaleDateString()
  ];
  
  return headers.join(',') + '\n' + values.join(',');
};

/**
 * Generate and download a tax report as CSV
 */
export const downloadTaxReportCSV = (report: TaxReportData): void => {
  const csvContent = generateTaxReportCSV(report);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
