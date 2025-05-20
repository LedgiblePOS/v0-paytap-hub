
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export type ExportFormat = 'csv' | 'xlsx' | 'json';

export interface ExportOptions {
  fileName?: string;
  format?: ExportFormat;
  sheets?: { [sheetName: string]: any[] };
  includeTimestamp?: boolean;
}

/**
 * Export data to different file formats
 * @param data - Data to export
 * @param options - Export options
 */
export const exportData = (data: any[], options: ExportOptions = {}): void => {
  const {
    fileName = 'export',
    format = 'xlsx',
    includeTimestamp = true
  } = options;

  const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
  const fullFileName = `${fileName}${timestamp}`;

  switch (format) {
    case 'csv':
      exportToCsv(data, `${fullFileName}.csv`);
      break;
    case 'xlsx':
      exportToExcel(data, options.sheets || { 'Data': data }, `${fullFileName}.xlsx`);
      break;
    case 'json':
      exportToJson(data, `${fullFileName}.json`);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Export data to CSV format
 */
const exportToCsv = (data: any[], fileName: string): void => {
  if (!data.length) {
    throw new Error('No data to export');
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle special cases (commas, quotes)
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma
        if (value.includes(',') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

/**
 * Export data to Excel format
 */
const exportToExcel = (data: any[], sheets: { [sheetName: string]: any[] }, fileName: string): void => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add sheets
  for (const [sheetName, sheetData] of Object.entries(sheets)) {
    if (sheetData && sheetData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
  }

  // Generate file and trigger download
  XLSX.writeFile(wb, fileName);
};

/**
 * Export data to JSON format
 */
const exportToJson = (data: any[], fileName: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  saveAs(blob, fileName);
};
