
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { InventoryFilter as InventoryFilterType } from '@/types/inventory';

interface InventoryFilterProps {
  categories: string[];
  onFilterChange: (filter: InventoryFilterType) => void;
  className?: string;
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({ 
  categories, 
  onFilterChange, 
  className = "" 
}) => {
  const [filter, setFilter] = useState<InventoryFilterType>({
    search: '',
    category: '',
    stockStatus: 'all'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, search: e.target.value };
    setFilter(newFilter);
  };

  const handleCategoryChange = (value: string) => {
    const newFilter = { ...filter, category: value };
    setFilter(newFilter);
  };

  const handleStockStatusChange = (value: string) => {
    const newFilter = { ...filter, stockStatus: value as InventoryFilterType['stockStatus'] };
    setFilter(newFilter);
  };

  const clearFilters = () => {
    setFilter({
      search: '',
      category: '',
      stockStatus: 'all'
    });
  };

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  return (
    <div className={`flex flex-wrap gap-2 mb-4 ${className}`}>
      <div className="flex grow items-center relative max-w-xs">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          className="pl-8"
          value={filter.search}
          onChange={handleSearchChange}
        />
        {filter.search && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 h-full" 
            onClick={() => setFilter({...filter, search: ''})}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select value={filter.category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All categories</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filter.stockStatus} onValueChange={handleStockStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Stock Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All items</SelectItem>
          <SelectItem value="in_stock">In stock</SelectItem>
          <SelectItem value="low_stock">Low stock</SelectItem>
          <SelectItem value="out_of_stock">Out of stock</SelectItem>
        </SelectContent>
      </Select>

      {(filter.search || filter.category || filter.stockStatus !== 'all') && (
        <Button variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default InventoryFilter;
