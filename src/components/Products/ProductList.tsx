
import React from "react";
import { ProductModel } from "@/types";
import ProductCard from "@/components/Products/ProductCard";
import EmptyProductState from "@/components/Products/EmptyProductState";
import { Loader2 } from "lucide-react";

export interface ProductListProps {
  products: ProductModel[];
  isLoading: boolean;
  onAddProduct: () => void;
  onViewProduct: (product: ProductModel) => void;
  onEditProduct: (product: ProductModel) => void;
  onDeleteProduct: (product: ProductModel) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  onAddProduct,
  onViewProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyProductState onAddProduct={onAddProduct} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onView={() => onViewProduct(product)}
          onEdit={() => onEditProduct(product)}
          onDelete={() => onDeleteProduct(product)}
        />
      ))}
    </div>
  );
};

export default ProductList;
