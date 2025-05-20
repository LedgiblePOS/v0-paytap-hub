
import { Card, CardContent } from '@/components/ui/card';
import ProductSelection from '../ProductSelection';
import { ProductEntity, ProductModel } from '@/types/product';
import { CategoryModel } from '@/types/category';
import { toProductModels } from '@/utils/modelConversions/productConverters';

interface ProductsTabProps {
  products: ProductEntity[];
  categories: CategoryModel[];
  onProductSelect: (product: ProductModel) => void;
}

const ProductsTab = ({ products, categories, onProductSelect }: ProductsTabProps) => {
  // Convert ProductEntity[] to ProductModel[]
  const productModels = toProductModels(products);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <ProductSelection
          products={products}
          categories={categories}
          onProductSelect={onProductSelect}
        />
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
