
import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl } from '@/utils/performance';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  alt: string;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc = '',
  width,
  height,
  quality = 80,
  priority = false,
  loading = 'lazy',
  alt,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);

    // Generate optimized image URL
    const optimizedSrc = getOptimizedImageUrl(src, width);
    setImageSrc(optimizedSrc);

    // Preload image if priority is true
    if (priority && optimizedSrc) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = optimizedSrc;
      document.head.appendChild(preloadLink);
      
      return () => {
        document.head.removeChild(preloadLink);
      };
    }
  }, [src, width, priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      {isLoading && (
        <Skeleton className="w-full h-full absolute top-0 left-0" />
      )}
      <img
        src={error && fallbackSrc ? fallbackSrc : imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "max-w-full", 
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
