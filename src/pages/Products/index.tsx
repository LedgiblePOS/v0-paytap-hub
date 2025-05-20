
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ProductList from '@/components/Products/ProductList';
import { ProductModel } from '@/types';
import { Plus, Search, Filter } from 'lucide-react';

// Mock data for testing
const mockProducts: ProductModel[] = [
  {
    id: "1",
    merchantId: "merchant-1",
    name: "Wireless Earbuds",
    description: "High-quality wireless earbuds with noise cancellation",
    price: 99.99,
    categoryId: "electronics",
    inStock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    id: "2",
    merchantId: "merchant-1",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 20-hour battery life",
    price: 79.99,
    categoryId: "electronics",
    inStock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    id: "3",
    merchantId: "merchant-1",
    name: "Smartphone Stand",
    description: "Adjustable smartphone stand for desk or bedside",
    price: 24.99,
    categoryId: "accessories",
    inStock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150"
  }
];

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>(mockProducts);
  
  const handleAddProduct = () => {
    console.log("Add product clicked");
    // This would open a modal or navigate to add product page
  };
  
  const handleViewProduct = (product: ProductModel) => {
    console.log("View product:", product);
    // This would navigate to product detail page
  };
  
  const handleEditProduct = (product: ProductModel) => {
    console.log("Edit product:", product);
    // This would open edit modal or navigate to edit page
  };
  
  const handleDeleteProduct = (product: ProductModel) => {
    console.log("Delete product:", product);
    // This would show a confirmation dialog before deleting
  };

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
          
          <ProductList
            products={products}
            isLoading={isLoading}
            onAddProduct={handleAddProduct}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
