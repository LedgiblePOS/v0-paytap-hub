
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductModel } from '@/types/product';
import { formatCurrency } from '@/utils/formatters';

interface ProductGridProps {
  products: ProductModel[];
  onProductSelect: (product: ProductModel) => void;
}

const ProductGrid = ({ products, onProductSelect }: ProductGridProps) => {
  const handleProductClick = (product: ProductModel) => {
    onProductSelect(product);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className={(product.inStock <= 0) ? 'opacity-50' : ''}
        >
          <CardContent className="p-2">
            <div className="flex flex-col h-full">
              {product.imageUrl && (
                <div className="relative rounded-md overflow-hidden mb-2" style={{ height: '120px' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {(product.inStock <= 0) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                <div className="text-xs text-muted-foreground mb-2">
                  In stock: {product.inStock}
                </div>
                <div className="font-medium">{formatCurrency(product.price)}</div>
              </div>

              <Button 
                onClick={() => handleProductClick(product)} 
                className="w-full mt-2"
                variant="secondary"
                size="sm"
                disabled={product.inStock <= 0}
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {products.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No products found. Try adjusting your search.
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
