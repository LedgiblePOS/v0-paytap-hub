
import { useState, useEffect } from 'react';
import { transformSnakeToCamel, transformCamelToSnake, isSnakeCaseObject } from '@/utils/transform';

/**
 * Custom hook to automatically transform data between snake_case and camelCase
 */
export function useTransform<T extends Record<string, any>>(
  data: T | null | undefined, 
  targetCase: 'camel' | 'snake' = 'camel'
): T | null | undefined {
  const [transformed, setTransformed] = useState<T | null | undefined>(data);

  useEffect(() => {
    if (!data) {
      setTransformed(data);
      return;
    }

    if (targetCase === 'camel') {
      // Only transform if it looks like a snake_case object
      if (isSnakeCaseObject(data)) {
        setTransformed(transformSnakeToCamel(data) as unknown as T);
      } else {
        setTransformed(data);
      }
    } else {
      setTransformed(transformCamelToSnake(data) as unknown as T);
    }
  }, [data, targetCase]);

  return transformed;
}

/**
 * HOC to automatically transform props between snake_case and camelCase
 */
export function withTransform<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  propsToTransform: Array<keyof P> = [],
  targetCase: 'camel' | 'snake' = 'camel'
): React.FC<P> {
  // Return a function component
  return function WithTransform(props: P) {
    const transformedProps = { ...props };

    propsToTransform.forEach(key => {
      if (key in props && props[key] && typeof props[key] === 'object') {
        // Type assertion to avoid TypeScript errors
        if (targetCase === 'camel') {
          transformedProps[key] = transformSnakeToCamel(props[key]) as any;
        } else {
          transformedProps[key] = transformCamelToSnake(props[key]) as any;
        }
      }
    });

    // Use React.createElement to avoid JSX transform issues
    return React.createElement(Component, transformedProps);
  };
}
