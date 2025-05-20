
import React, { SetStateAction } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dispatch } from "react";

interface DataImportCardProps {
  onImport: () => Promise<void>;
  isImporting: boolean;
  importFile: File | null;
  setImportFile: Dispatch<SetStateAction<File | null>>;
}

const DataImportCard: React.FC<DataImportCardProps> = ({ 
  onImport, 
  isImporting, 
  importFile, 
  setImportFile 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Import Data
        </CardTitle>
        <CardDescription>Import data from external sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-2 border-dashed rounded-md p-6 border-gray-300 text-center">
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept=".json,.csv,.xlsx"
              disabled={isImporting}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <FileText className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium">
                {importFile ? importFile.name : "Click to upload a file"}
              </span>
              <span className="text-xs text-muted-foreground">
                Supported formats: .json, .csv, .xlsx
              </span>
            </label>
          </div>

          {importFile && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                File selected: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
              </AlertDescription>
            </Alert>
          )}
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Importing data may overwrite existing records. Make sure to export your current data as a backup first.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onImport}
          disabled={!importFile || isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            "Import Data"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataImportCard;
