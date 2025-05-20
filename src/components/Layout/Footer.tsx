
import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-3 px-4 text-center text-sm text-muted-foreground">
      <div className="container mx-auto">
        © {year} Merchant System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
