
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  
  return (
    <MainLayoutContent>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Product Details</h2>
        <p className="text-muted-foreground">View and manage product information.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Product #{id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Product details will be loaded here.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayoutContent>
  );
};

export default ProductDetails;
