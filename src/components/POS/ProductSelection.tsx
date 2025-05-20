
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryModel } from '@/types/category';
import { ProductModel, ProductEntity } from '@/types/product';
import ProductGrid from './ProductGrid';
import { toProductModels } from '@/utils/modelConversions/productConverters';

interface ProductSelectionProps {
  products: ProductEntity[];
  categories: CategoryModel[];
  onProductSelect: (product: ProductModel) => void;
}

const ProductSelection = ({ products, categories, onProductSelect }: ProductSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    // Convert entity products to model products
    const productModels = toProductModels(products);

    // Filter products based on search query and selected category
    const filtered = productModels.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProductGrid products={filteredProducts} onProductSelect={onProductSelect} />
    </div>
  );
};

export default ProductSelection;
