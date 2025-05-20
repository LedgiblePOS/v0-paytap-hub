
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Suppliers = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Suppliers</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Suppliers List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Suppliers will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;
