
import React from "react";
import { AlertTriangle } from "lucide-react";

interface SecurityNoticeProps {
  message?: string;
}

const SecurityNotice: React.FC<SecurityNoticeProps> = ({ 
  message = "Changing these settings affects all users across the platform. Any modifications to password policies will apply to new passwords and password resets only."
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-amber-800">Important Security Notice</p>
        <p className="text-sm text-amber-700">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SecurityNotice;
