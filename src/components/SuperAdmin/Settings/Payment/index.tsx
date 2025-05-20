
import React from "react";
import LynkSettings from "./LynkSettings";

// ...additional settings for Fasstap/CBDC...

const PaymentSettingsAdmin: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Add Fasstap/CBDC sections here if needed for global config */}
      <LynkSettings />
    </div>
  );
};

export default PaymentSettingsAdmin;
