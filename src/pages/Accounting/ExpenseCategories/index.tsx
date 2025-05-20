
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExpenseCategories = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Expense Categories</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Expense categories will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseCategories;
