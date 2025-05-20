
import React from "react";
import { useLocation } from "react-router-dom";
import PaymentStatusDisplay from "@/components/Checkout/PaymentStatus";

const Cancelled: React.FC = () => {
  const location = useLocation();
  const errorMessage = location.state?.errorMessage || 'Payment was cancelled';

  return (
    <div className="container mx-auto py-12">
      <PaymentStatusDisplay 
        status="cancelled"
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default Cancelled;
