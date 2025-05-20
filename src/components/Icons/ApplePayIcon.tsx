
import React from 'react';

interface ApplePayIconProps {
  className?: string;
}

const ApplePayIcon: React.FC<ApplePayIconProps> = ({ className }) => {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M17.72 17.28a8.30513 8.30513 0 0 1-4.12 1.11c-.5.01-1-.03-1.48-.11-1.41-.25-2.73-.9-3.6-2.4M6.09 11.02c.21-.94.64-1.76 1.57-2.26.94-.5 1.92-.39 2.86.13.94.52 1.68.52 2.62 0 .94-.52 1.92-.63 2.86-.13.17.09.33.19.48.31M9 7V3h6v4M5 23l2-3m4.5-8c0 2.76-2.24 5-5 5m0 0h-.5M16 23l-2-3m1-13c0 2.76 2.24 5 5 5" />
    </svg>
  );
};

export default ApplePayIcon;
