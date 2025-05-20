
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface EmptyProductStateProps {
  onAddProduct: () => void;
}

const EmptyProductState: React.FC<EmptyProductStateProps> = ({ onAddProduct }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
      <Tag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
      <p className="text-gray-500 mb-6">
        Get started by adding your first product or adjusting your search criteria.
      </p>
      <Button onClick={onAddProduct}>
        Add Product
      </Button>
    </div>
  );
};

export default EmptyProductState;
