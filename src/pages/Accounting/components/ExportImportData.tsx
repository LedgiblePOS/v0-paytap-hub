
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { exportAccountingData, importAccountingData } from '@/services/accounting/exportImportService';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { saveAs } from 'file-saver';

interface ExportImportDataProps {
  merchantId: string | undefined;
  onDataImported?: () => void;
}

const ExportImportData: React.FC<ExportImportDataProps> = ({ merchantId, onDataImported }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const handleExport = async () => {
    if (!merchantId) {
      toast({
        title: "Error",
        description: "Merchant ID is required to export data",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting(true);
      toast({
        title: "Export Started",
        description: "Preparing your accounting data for export..."
      });
      
      const blob = await exportAccountingData(merchantId);
      
      // Use current date for filename
      const date = new Date().toISOString().split('T')[0];
      saveAs(blob, `accounting_data_${date}.xlsx`);
      
      toast({
        title: "Export Completed",
        description: "Accounting data has been exported successfully"
      });
      
      setIsExporting(false);
    } catch (error) {
      setIsExporting(false);
      toast({
        title: "Export Failed",
        description: `Error exporting data: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };
  
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    } else {
      setImportFile(null);
    }
  };
  
  const handleImport = async () => {
    if (!merchantId) {
      toast({
        title: "Error",
        description: "Merchant ID is required to import data",
        variant: "destructive"
      });
      return;
    }
    
    if (!importFile) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsImporting(true);
      toast({
        title: "Import Started",
        description: "Processing your accounting data..."
      });
      
      const result = await importAccountingData(merchantId, importFile);
      
      toast({
        title: "Import Completed",
        description: `Successfully imported ${result.importedExpenses} expenses and ${result.importedIncomes} income entries`
      });
      
      // Reset state
      setImportFile(null);
      setImportDialogOpen(false);
      setIsImporting(false);
      
      // Notify parent component
      if (onDataImported) {
        onDataImported();
      }
    } catch (error) {
      setIsImporting(false);
      toast({
        title: "Import Failed",
        description: `Error importing data: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExport}
        disabled={isExporting || !merchantId}
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Exporting..." : "Export"}
      </Button>
      
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!merchantId}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Accounting Data</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="import-file">Select Excel File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFileChange}
                className="mt-2"
              />
              
              {importFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  {importFile.name} ({Math.round(importFile.size / 1024)} KB)
                </p>
              )}
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4 text-amber-800">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Import Notes:</p>
                    <ul className="text-sm list-disc pl-5 mt-1">
                      <li>The Excel file should have separate sheets for Expenses and Income.</li>
                      <li>Required columns: Date, Description, Amount, Category/Source</li>
                      <li>Existing transactions will not be affected.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleImport} 
              disabled={!importFile || isImporting}
              className="mt-4"
            >
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportImportData;
