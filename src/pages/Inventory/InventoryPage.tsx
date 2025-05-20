
import React, { useState } from 'react';
import InventoryHeader from './components/InventoryHeader';
import InventorySummary from './components/InventorySummary';
import InventoryList from './components/InventoryList';
import InventoryLoading from './components/InventoryLoading';
import { useInventory } from './hooks/useInventory';

const InventoryPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { inventoryData, isLoading, totalValue, refetch } = useInventory();

  const handleAddProduct = () => {
    console.log('Add product clicked');
    // Implementation for adding a new product would go here
  };

  const handleImport = () => {
    console.log('Import clicked');
    // Implementation for importing inventory would go here
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Implementation for exporting inventory would go here
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
    console.log('Filter clicked', showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <InventoryHeader 
        onAddProduct={handleAddProduct}
        onImport={handleImport}
        onExport={handleExport}
        onFilter={handleFilter}
      />
      
      {isLoading ? (
        <InventoryLoading />
      ) : (
        <>
          <InventorySummary />
          <div className="mt-6">
            <InventoryList />
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryPage;
