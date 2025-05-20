
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Upload } from "lucide-react";

interface ImportSectionProps {
  onImport: () => Promise<void>;
  isImporting: boolean;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
}

const ImportSection: React.FC<ImportSectionProps> = ({ 
  onImport, 
  isImporting, 
  importFile, 
  setImportFile 
}) => {
  return (
    <>
      <div>
        <label className="text-sm font-medium">Select File</label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            type="file"
            disabled={isImporting}
            accept=".csv,.json,.xlsx"
            onChange={(e) => setImportFile(e.target.files?.[0] || null)}
          />
          <Button 
            onClick={onImport} 
            disabled={!importFile || isImporting}
            className="flex items-center gap-1"
          >
            {isImporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Supported formats: CSV, JSON, Excel
        </p>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <FileText className="h-4 w-4" />
        <AlertTitle>Import Guidelines</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside text-sm mt-2">
            <li>Files must match our expected format</li>
            <li>Large files may take some time to process</li>
            <li>Importing will merge data with existing records</li>
            <li>We recommend backing up your data before importing</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <TemplateFiles />
    </>
  );
};

const TemplateFiles: React.FC = () => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Template Files</h4>
      <div className="space-y-2">
        {["Product Import Template", "Customer Import Template", "Order Import Template"].map((template, i) => (
          <div key={i} className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{template}</span>
            <Button variant="ghost" size="sm" className="ml-auto h-7">
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportSection;
