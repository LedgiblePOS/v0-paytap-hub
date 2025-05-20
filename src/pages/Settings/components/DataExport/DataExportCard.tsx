
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import ExportForm from "./ExportForm";
import { DataExportImportForm } from "../../schema";

interface DataExportCardProps {
  onExport: (data: DataExportImportForm) => Promise<void>;
  isExporting: boolean;
}

const DataExportCard: React.FC<DataExportCardProps> = ({ onExport, isExporting }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export Data
        </CardTitle>
        <CardDescription>Download your business data</CardDescription>
      </CardHeader>
      <CardContent>
        <ExportForm onExport={onExport} isExporting={isExporting} />
      </CardContent>
    </Card>
  );
};

export default DataExportCard;
