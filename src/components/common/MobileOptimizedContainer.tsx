
import React, { useEffect, useState } from 'react';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  breakpoints?: {
    mobile: number;
    tablet: number;
  };
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({
  children,
  className = "",
  mobileClassName = "",
  tabletClassName = "",
  desktopClassName = "",
  breakpoints = {
    mobile: 640,
    tablet: 1024
  }
}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.mobile) {
        setDeviceType('mobile');
      } else if (width < breakpoints.tablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    // Initialize device type
    handleResize();
    
    // Set up event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints.mobile, breakpoints.tablet]);

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  let deviceClassName = '';
  switch (deviceType) {
    case 'mobile':
      deviceClassName = mobileClassName;
      break;
    case 'tablet':
      deviceClassName = tabletClassName;
      break;
    case 'desktop':
      deviceClassName = desktopClassName;
      break;
  }

  return (
    <div 
      className={`${className} ${deviceClassName}`}
      data-device={deviceType}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
