import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, Download, FileSpreadsheet } from 'lucide-react';
import { AuditLog } from '@/types/audit';
import { toAuditLogModels } from '@/utils/modelConversions';
import PageContainer from '@/components/common/PageContainer';

interface ReportData {
  date: string;
  revenue: number;
  transactions: number;
  averageOrderValue: number;
}

const generateMockReportData = (startDate: Date, endDate: Date): ReportData[] => {
  const data: ReportData[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const revenue = Math.random() * 1000;
    const transactions = Math.floor(Math.random() * 50);
    const averageOrderValue = revenue / transactions || 0;

    data.push({
      date: dateStr,
      revenue: parseFloat(revenue.toFixed(2)),
      transactions,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const MerchantReports: React.FC = () => {
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());

  const reportData = React.useMemo(() => generateMockReportData(startDate, endDate), [startDate, endDate]);

  const handleDownload = () => {
    const csvRows = [];
    const headers = Object.keys(reportData[0]).join(',');
    csvRows.push(headers);

    for (const row of reportData) {
      const values = Object.values(row).join(',');
      csvRows.push(values);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `merchant_report_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <PageContainer title="Merchant Reports">
      <Card>
        <CardHeader>
          <CardTitle>Merchant Reports</CardTitle>
          <CardDescription>Generate and download reports for your merchant account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="report-type">
                  Report Type
                </label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select report type" />
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="start-date">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="end-date">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={format(endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />
              </div>
            </div>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Data</CardTitle>
          <CardDescription>A summary of your merchant activity.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Average Order Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.date}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell>${row.revenue}</TableCell>
                  <TableCell>{row.transactions}</TableCell>
                  <TableCell>${row.averageOrderValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default MerchantReports;
