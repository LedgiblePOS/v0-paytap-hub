
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Download, Filter } from 'lucide-react';

interface InventoryHeaderProps {
  onAddProduct: () => void;
  onImport: () => void;
  onExport: () => void;
  onFilter: () => void;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  onAddProduct,
  onImport,
  onExport,
  onFilter
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Manage your product inventory</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button variant="outline" size="sm" onClick={onFilter}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button size="sm" onClick={onAddProduct}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;
