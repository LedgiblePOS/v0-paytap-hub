
import React from "react";
import { CreditCard, Terminal, Plug } from "lucide-react";
import PaymentMethodCard from "./PaymentMethodCard";

interface PaymentsOverviewProps {
  useCBDC: boolean;
}

const PaymentsOverview: React.FC<PaymentsOverviewProps> = ({ useCBDC }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PaymentMethodCard 
        icon={<CreditCard className="h-8 w-8" />}
        title="Card Payments"
        description="Accept credit/debit card payments"
        status="Active"
      />
      <PaymentMethodCard 
        icon={<Terminal className="h-8 w-8" />}
        title="Tap to Pay"
        description="Contactless NFC payments"
        status="Active"
      />
      <PaymentMethodCard 
        icon={<Plug className="h-8 w-8" />}
        title="CBDC Payments"
        description="Digital currency transactions"
        status={useCBDC ? "Active" : "Available"}
      />
    </div>
  );
};

export default PaymentsOverview;
