
import React from "react";
import DataExportCard from "./DataExportCard";
import DataImportCard from "./DataImportCard";
import { useDataExport } from "./useDataExport";

const DataExportImport: React.FC = () => {
  const {
    isExporting,
    isImporting,
    importFile,
    setImportFile,
    handleExport,
    handleImport
  } = useDataExport();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Data Export & Import</h2>
      <p className="text-muted-foreground mb-6">
        Export your data for backup or analysis, or import data from external sources.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DataExportCard 
          onExport={handleExport} 
          isExporting={isExporting} 
        />
        
        <DataImportCard 
          onImport={handleImport}
          isImporting={isImporting}
          importFile={importFile}
          setImportFile={setImportFile}
        />
      </div>
    </div>
  );
};

export default DataExportImport;
