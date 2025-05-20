
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, DollarSign, Search } from 'lucide-react';
import { useTaxReports, TaxReport } from '../hooks/useTaxReports';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TaxReportList: React.FC = () => {
  const { reports, isLoading, downloadReport } = useTaxReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  
  // Get unique years for filter options
  const years = Array.from(new Set(reports.map(report => report.year))).sort((a, b) => b - a);
  
  // Filter reports based on search and filter criteria
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'all' || report.year.toString() === yearFilter;
    const matchesPeriod = periodFilter === 'all' || report.period === periodFilter;
    return matchesSearch && matchesYear && matchesPeriod;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">No reports available</h3>
          <p className="text-muted-foreground text-center">
            Generate a tax report using the download button on the overview page
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Periods</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center p-8 border rounded-md">
            <p className="text-muted-foreground">No reports match your search criteria</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} onDownload={downloadReport} />
          ))
        )}
      </div>
    </div>
  );
};

interface ReportCardProps {
  report: TaxReport;
  onDownload: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDownload }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        
        <div>
          <h3 className="font-semibold">{report.title}</h3>
          <div className="flex flex-wrap gap-2 mt-1 items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Generated on {report.generatedDate}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {report.period}
            </Badge>
            <div className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              <span>Total: ${report.totalTax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onDownload(report.id)}
        className="w-full sm:w-auto mt-2 sm:mt-0"
      >
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
    </div>
  );
};

export default TaxReportList;
