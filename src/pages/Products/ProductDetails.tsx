
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Product ID: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Product details will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
