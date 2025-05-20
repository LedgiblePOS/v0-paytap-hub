
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const InventoryList: React.FC = () => {
  // Placeholder data - would come from API
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      sku: 'PRD001',
      name: 'T-Shirt - Medium',
      category: 'Apparel',
      stock: 25,
      price: 19.99,
      status: 'In Stock'
    },
    {
      id: '2',
      sku: 'PRD002',
      name: 'Wireless Headphones',
      category: 'Electronics',
      stock: 5,
      price: 89.99,
      status: 'Low Stock'
    },
    {
      id: '3',
      sku: 'PRD003',
      name: 'Water Bottle 750ml',
      category: 'Accessories',
      stock: 0,
      price: 14.50,
      status: 'Out of Stock'
    },
    {
      id: '4',
      sku: 'PRD004',
      name: 'Notebook - Hardcover',
      category: 'Stationery',
      stock: 35,
      price: 9.99,
      status: 'In Stock'
    },
    {
      id: '5',
      sku: 'PRD005',
      name: 'Coffee Mug',
      category: 'Kitchenware',
      stock: 12,
      price: 12.99,
      status: 'In Stock'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">{item.stock}</TableCell>
              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryList;
