
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/Routes/ProtectedRoute";

// This is a placeholder component - update with actual shared routes
const SharedRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Add shared routes that both merchant and admin can access */}
      <Route path="/shared-settings" element={
        <ProtectedRoute>
          <div>Shared Settings Page</div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default SharedRoutes;
