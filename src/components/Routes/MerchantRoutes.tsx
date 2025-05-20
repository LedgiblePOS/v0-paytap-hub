
import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ProtectedMerchantLayout from './merchant/ProtectedMerchantLayout';
// Import from the index file directly
import Inventory from '@/pages/Inventory';
import Products from '@/pages/Products';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import POS from '@/pages/POS';
import Analytics from '@/pages/Analytics';
import ProductDetails from '@/pages/Products/ProductDetails';

const MerchantRoutes = () => {
  return (
    <Route element={<ProtectedMerchantLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pos" element={<POS />} />
      <Route path="/analytics" element={<Analytics />} />
    </Route>
  );
};

export default MerchantRoutes;
