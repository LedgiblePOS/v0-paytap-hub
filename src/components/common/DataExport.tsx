
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

export interface DataExportProps<T extends object> {
  data: T[] | Record<string, any>[];
  filename?: string;
  fields?: Array<keyof T & string>;
  label?: string;
  format?: 'csv' | 'json';
  disabled?: boolean;
}

export function DataExport<T extends object>({
  data,
  filename = 'export',
  fields,
  label = 'Export',
  format: exportFormat = 'csv',
  disabled = false
}: DataExportProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    try {
      setIsExporting(true);
      
      // Process data for export
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const processedFilename = `${filename}_${timestamp}`;
      
      // If fields are specified, only include those fields
      let exportData: Record<string, any>[] = [];
      
      if (Array.isArray(data)) {
        if (fields && fields.length > 0) {
          exportData = data.map(item => {
            const newItem: Record<string, any> = {};
            fields.forEach(field => {
              if (typeof field === 'string' && field in item) {
                newItem[field] = (item as any)[field];
              }
            });
            return newItem;
          });
        } else {
          // Use all fields
          exportData = data as Record<string, any>[];
        }
      }
      
      // Generate the export content
      let content: string = '';
      let mimeType: string = '';
      let extension: string = '';
      
      if (exportFormat === 'csv') {
        if (exportData.length === 0) {
          content = '';
        } else {
          const headers = Object.keys(exportData[0]).join(',');
          const rows = exportData.map(item => 
            Object.values(item)
              .map(value => 
                typeof value === 'string' 
                  ? `"${value.replace(/"/g, '""')}"` 
                  : String(value)
              )
              .join(',')
          );
          content = [headers, ...rows].join('\n');
        }
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        content = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }
      
      // Create and download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${processedFilename}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={disabled || isExporting || data.length === 0}
      variant="outline"
      size="sm"
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : label}
    </Button>
  );
}

export default DataExport;
