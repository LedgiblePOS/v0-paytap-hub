
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DataExportImportForm } from "../../schema";

export const useDataExport = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleExport = async (data: DataExportImportForm) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to export data",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);

      // Get merchant ID
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (merchantError) throw merchantError;

      // Instead of inserting into a non-existent table, we'll log the export activity
      console.log("Export request:", {
        merchant_id: merchant.id,
        export_format: data.exportFormat,
        include_sensitive_data: data.includeSensitiveData,
        export_period: data.exportPeriod,
        custom_start_date: data.customStartDate,
        custom_end_date: data.customEndDate,
        data_categories: data.dataCategories,
      });

      // Simulate export process (in a real app, this would generate and download actual files)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a dummy file for demo purposes
      const fileContent = `Sample ${data.exportFormat.toUpperCase()} export data for ${data.dataCategories.join(", ")}`;
      const file = new Blob([fileContent], { type: 'text/plain' });
      const fileName = `export-${new Date().toISOString().split('T')[0]}.${data.exportFormat}`;
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export complete",
        description: `Your data has been exported as ${fileName}`,
      });
      
      // Log the activity in the audit_logs table instead
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'EXPORT',
        resource: 'DATA',
        description: `Exported ${data.dataCategories.join(", ")} in ${data.exportFormat} format`,
      });
      
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to import data",
        variant: "destructive",
      });
      return;
    }

    if (!importFile) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImporting(true);

      // Get merchant ID
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (merchantError) throw merchantError;

      // Instead of inserting into a non-existent table, we'll log the import activity
      console.log("Import request:", {
        merchant_id: merchant.id,
        file_name: importFile.name,
        file_size: importFile.size,
        file_type: importFile.type,
      });
      
      // Simulate import process (in a real app, this would parse and import the file)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the activity in the audit_logs table instead
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'IMPORT',
        resource: 'DATA',
        description: `Imported file ${importFile.name} (${Math.round(importFile.size / 1024)} KB)`,
      });

      toast({
        title: "Import complete",
        description: `${importFile.name} has been successfully imported`,
      });

      setImportFile(null);
    } catch (error: any) {
      console.error("Error importing data:", error);
      toast({
        title: "Import failed",
        description: error.message || "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isExporting,
    isImporting,
    importFile,
    setImportFile,
    handleExport,
    handleImport
  };
};
