import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Download, FileText } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { format } from 'date-fns';
import { validateForm } from '@/utils/formValidation';
import * as z from 'zod';
import { DateRange, convertToAccountingDateRange, convertToDayPickerDateRange } from '@/types/accounting';

const reportFilterSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional(),
  }).optional(),
  merchantId: z.string().optional(),
  reportType: z.enum(['all', 'quarterly', 'annual'])
});

type ReportFilterValues = z.infer<typeof reportFilterSchema>;

const defaultDateRange: DateRange = {
  from: new Date(),
  to: new Date(),
};

const TaxReportingRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<{ id: string, name: string }[]>([]);
  const [activeTab, setActiveTab] = useState('reports');
  const [filters, setFilters] = useState<ReportFilterValues>({
    reportType: 'all'
  });
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadMerchants() {
      try {
        const { data, error } = await supabase
          .from('merchants')
          .select('id, business_name');
        
        if (error) throw error;
        
        setMerchants(data?.map(m => ({ id: m.id, name: m.business_name || 'Unknown Business' })) || []);
      } catch (err) {
        console.error('Error loading merchants:', err);
      }
    }
    
    loadMerchants();
  }, []);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      try {
        let query = supabase
          .from('tax_reports')
          .select(`
            *,
            merchants:merchant_id (id, business_name)
          `)
          .order('generated_at', { ascending: false });
        
        if (filters.merchantId) {
          query = query.eq('merchant_id', filters.merchantId);
        }
        
        if (dateRange?.from) {
          query = query.gte('generated_at', dateRange.from.toISOString());
        }
        
        if (dateRange?.to) {
          const endDate = new Date(dateRange.to);
          endDate.setDate(endDate.getDate() + 1);
          query = query.lt('generated_at', endDate.toISOString());
        }
        
        if (filters.reportType === 'quarterly') {
          query = query.not('quarter', 'is', null);
        } else if (filters.reportType === 'annual') {
          query = query.is('quarter', null);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error('Error loading tax reports:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadReports();
  }, [filters, dateRange]);

  const handleFilterChange = (field: string, value: any) => {
    validateForm(
      reportFilterSchema, 
      { ...filters, [field]: value },
      (validData) => {
        setFilters(validData);
        setFormErrors({});
      },
      (errors) => setFormErrors(errors)
    );
  };

  const handleDateRangeChange = (range: any) => {
    setDateRange(convertToAccountingDateRange(range) || defaultDateRange);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tax Reporting</CardTitle>
        <CardDescription>
          View and manage tax reports for all merchants
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-6">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Tax Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="p-0">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="ml-4"
                />
                {formErrors.dateRange && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.dateRange}</p>
                )}
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block">Merchant</label>
                <Select
                  value={filters.merchantId || ''}
                  onValueChange={(value) => handleFilterChange('merchantId', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All merchants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All merchants</SelectItem>
                    {merchants.map(merchant => (
                      <SelectItem key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block">Report Type</label>
                <Select
                  value={filters.reportType}
                  onValueChange={(value) => handleFilterChange('reportType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableCaption>List of generated tax reports</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Total Income</TableHead>
                    <TableHead className="text-right">Total Expenses</TableHead>
                    <TableHead className="text-right">Taxable Income</TableHead>
                    <TableHead className="text-right">Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length > 0 ? (
                    reports.map(report => (
                      <TableRow key={report.id}>
                        <TableCell>{report.merchants?.business_name || 'Unknown'}</TableCell>
                        <TableCell>
                          {report.quarter ? `Q${report.quarter} ${report.year}` : `FY ${report.year}`}
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(report.total_income).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(report.total_expenses).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(report.taxable_income).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {format(new Date(report.generated_at), 'PP')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No tax reports found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="settings">
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Tax settings management coming soon</p>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TaxReportingRoute;
