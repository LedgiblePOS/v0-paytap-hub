
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ImportResult, InventoryItem } from '@/types/inventory';
import { Download, Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface InventoryImportExportProps {
  inventoryItems: InventoryItem[];
  onImport: (items: Partial<InventoryItem>[]) => Promise<ImportResult>;
  merchantId: string;
}

const InventoryImportExport: React.FC<InventoryImportExportProps> = ({
  inventoryItems,
  onImport,
  merchantId
}) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
      setImportErrors([]);
      setImportSuccess(false);
    }
  };

  const handleExport = () => {
    try {
      // Transform inventory items for export
      const exportData = inventoryItems.map(item => ({
        Name: item.name,
        SKU: item.sku,
        Description: item.description || '',
        Category: item.category,
        Quantity: item.quantity,
        Cost: item.cost,
        'Selling Price': item.selling_price
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

      // Generate file and trigger download
      const fileName = `inventory-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "Export Successful",
        description: `${exportData.length} inventory items exported successfully.`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your inventory data.",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportErrors([]);
    setImportSuccess(false);

    try {
      // Read file
      const data = await importFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Transform data to match inventory item structure
      const items = jsonData.map((row: any) => ({
        merchant_id: merchantId,
        name: row.Name || row['Product Name'] || '',
        sku: row.SKU || row['Product Code'] || '',
        description: row.Description || '',
        category: row.Category || 'Uncategorized',
        quantity: Number(row.Quantity || row.Stock || 0),
        cost: Number(row.Cost || row['Purchase Price'] || 0),
        selling_price: Number(row['Selling Price'] || row.Price || 0),
      }));

      // Validate data
      const errors: string[] = [];
      items.forEach((item, index) => {
        if (!item.name) errors.push(`Row ${index + 1}: Missing product name`);
        if (!item.sku) errors.push(`Row ${index + 1}: Missing SKU`);
        if (item.selling_price <= 0) errors.push(`Row ${index + 1}: Invalid selling price`);
      });

      if (errors.length > 0) {
        setImportErrors(errors);
        setIsImporting(false);
        return;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Send data to import
      const result = await onImport(items);

      clearInterval(progressInterval);
      setImportProgress(100);

      if (result.success) {
        setImportSuccess(true);
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.rowsProcessed} inventory items.`
        });
      } else {
        setImportErrors(result.errors);
        toast({
          title: "Import Completed with Issues",
          description: `${result.errors.length} errors occurred during import.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportErrors([`Import failed: ${(error as Error).message}`]);
      toast({
        title: "Import Failed",
        description: "There was an error importing your inventory data.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setImportFile(null);
    setImportErrors([]);
    setImportSuccess(false);
    setImportProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsImportDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          className="flex items-center gap-2"
          disabled={inventoryItems.length === 0}
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Inventory</DialogTitle>
            <DialogDescription>
              Upload a spreadsheet file to import inventory items. 
              The file should include columns for Name, SKU, Description, Category, Quantity, Cost, and Selling Price.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {importFile ? (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-sm font-medium truncate max-w-[200px]">{importFile.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetImport}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            )}

            {isImporting && (
              <div className="space-y-2">
                <Progress value={importProgress} className="h-1" />
                <p className="text-sm text-center text-muted-foreground">
                  Importing... {importProgress}%
                </p>
              </div>
            )}

            {importSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">
                  Import completed successfully.
                </AlertDescription>
              </Alert>
            )}

            {importErrors.length > 0 && (
              <div className="max-h-40 overflow-auto rounded-md border p-3">
                <h4 className="font-medium mb-2 text-destructive">Import Errors:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {importErrors.slice(0, 10).map((error, index) => (
                    <li key={index} className="text-sm text-destructive">{error}</li>
                  ))}
                  {importErrors.length > 10 && (
                    <li className="text-sm text-destructive">
                      ...and {importErrors.length - 10} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!importFile || isImporting}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryImportExport;
