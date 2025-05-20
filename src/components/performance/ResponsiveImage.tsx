
import React from 'react';

// Define the ImageSrcSet type to avoid conflict with srcSet in ImgHTMLAttributes
export type ImageSrcSet = { 
  src: string; 
  width: number; 
}[];

export interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  src: string;
  alt: string;
  srcSets?: ImageSrcSet; // Using our custom type here
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  srcSets = [],
  sizes = '100vw',
  className,
  loading = 'lazy',
  width,
  height,
  ...rest
}) => {
  // Convert our srcSets to the string format that HTML expects
  const srcSetString = srcSets.length > 0 
    ? srcSets.map(item => `${item.src} ${item.width}w`).join(', ')
    : undefined;

  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSetString}
      sizes={sizes}
      loading={loading}
      className={className}
      width={width}
      height={height}
      {...rest}
    />
  );
};

export default ResponsiveImage;
