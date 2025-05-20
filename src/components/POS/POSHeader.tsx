
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine, Users, Receipt, Tag } from 'lucide-react';

interface POSHeaderProps {
  onSelectCustomer: () => void;
  onShowReceiptSettings: () => void;
  onNewSale: () => void;
}

const POSHeader: React.FC<POSHeaderProps> = ({ 
  onSelectCustomer, 
  onShowReceiptSettings, 
  onNewSale 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Point of Sale</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <ScanLine className="mr-2 h-4 w-4" />
          Scan Barcode
        </Button>
        <Button variant="outline" size="sm" onClick={onSelectCustomer}>
          <Users className="mr-2 h-4 w-4" />
          Select Customer
        </Button>
        <Button variant="outline" size="sm" onClick={onShowReceiptSettings}>
          <Receipt className="mr-2 h-4 w-4" />
          Receipt Settings
        </Button>
        <Button variant="default" size="sm" onClick={onNewSale}>
          <Tag className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>
    </div>
  );
};

export default POSHeader;
