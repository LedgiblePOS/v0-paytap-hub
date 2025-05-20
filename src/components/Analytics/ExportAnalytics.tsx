
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useToast } from '@/hooks/use-toast';

const ExportAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  
  const [reportType, setReportType] = useState('sales');
  const [format, setFormat] = useState('csv');

  // Safe string formatting function
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const handleExport = () => {
    if (!date?.from) {
      toast({
        title: "Date range required",
        description: "Please select a date range for the report.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Export Started",
      description: `Your ${reportType} report is being generated.`
    });

    // Mock export function
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${reportType} report has been exported as ${format.toUpperCase()}.`
      });

      // In a real app, this would generate and download the file
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Sample export data'));
      element.setAttribute('download', `${reportType}_report_${formatDate(date.from)}_to_${formatDate(date.to)}.${format}`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Reports</CardTitle>
        <CardDescription>
          Generate and download reports for your business data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="date-range" className="space-y-4">
          <TabsList>
            <TabsTrigger value="date-range">Date Range</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="date-range" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-2">Date Range</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {formatDate(date.from)} - {formatDate(date.to)}
                          </>
                        ) : (
                          formatDate(date.from)
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(newDate: DateRange | undefined) => {
                        if (newDate?.from) {
                          setDate(newDate);
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium mb-2">Report Type</span>
                  <Select defaultValue={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="customers">Customer Report</SelectItem>
                      <SelectItem value="transactions">Transactions Report</SelectItem>
                      <SelectItem value="taxes">Tax Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium mb-2">Format</span>
                  <Select defaultValue={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleExport} className="mt-4 w-full">
                Export Report
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-2">Preset Reports</span>
                <Select defaultValue="this-month">
                  <SelectTrigger>
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="year-to-date">Year to Date</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium mb-2">Report Type</span>
                  <Select defaultValue={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="customers">Customer Report</SelectItem>
                      <SelectItem value="transactions">Transactions Report</SelectItem>
                      <SelectItem value="taxes">Tax Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium mb-2">Format</span>
                  <Select defaultValue={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleExport} className="mt-4 w-full">
                Export Report
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExportAnalytics;
