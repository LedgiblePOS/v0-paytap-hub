
/**
 * Entity Model Fixer
 * 
 * This utility provides functions for automatically fixing the property name
 * mismatches between snake_case database entities and camelCase UI models.
 */

import * as React from 'react';

/**
 * Converts snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

/**
 * Converts camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Creates an AutoFixer proxy that automatically converts property accesses
 * between snake_case and camelCase formats.
 * 
 * @param target The object to wrap with the proxy
 * @param direction 'to-camel' to convert snake_case to camelCase, 'to-snake' for the opposite
 */
export function createAutoConvertingProxy<T extends Record<string, any>>(
  target: T,
  direction: 'to-camel' | 'to-snake' = 'to-camel'
): T {
  return new Proxy(target, {
    get(obj, prop) {
      if (typeof prop !== 'string') return obj[prop as keyof typeof obj];
      
      // Convert property name based on direction
      const convertedProp = direction === 'to-camel' 
        ? toSnakeCase(prop) 
        : toCamelCase(prop);
      
      // Try to access with the original prop first, then the converted one
      return obj[prop as keyof typeof obj] !== undefined 
        ? obj[prop as keyof typeof obj] 
        : obj[convertedProp as keyof typeof obj];
    },
    
    set(obj, prop, value) {
      if (typeof prop !== 'string') {
        obj[prop as keyof typeof obj] = value;
        return true;
      }
      
      // Convert property name based on direction
      const convertedProp = direction === 'to-camel' 
        ? toSnakeCase(prop) 
        : toCamelCase(prop);
      
      // Set using the preferred format for this direction
      const targetProp = direction === 'to-camel' ? convertedProp : prop;
      obj[targetProp as keyof typeof obj] = value;
      return true;
    }
  }) as T;
}

/**
 * Automatically creates proxies for all entities in a collection
 * 
 * @param entities Array of database entities or UI models
 * @param direction Direction of property name conversion
 */
export function createAutoConvertingProxies<T extends Record<string, any>>(
  entities: T[],
  direction: 'to-camel' | 'to-snake' = 'to-camel'
): T[] {
  return entities.map(entity => createAutoConvertingProxy(entity, direction));
}

/**
 * Higher-order function that wraps a component and automatically fixes
 * snake_case/camelCase property access issues.
 */
export function withAutoFixedProps<Props extends Record<string, any>>(
  Component: React.ComponentType<Props>,
  propsToFix: string[] = []
): React.FC<Props> {
  return (props: Props) => {
    const fixedProps = { ...props } as Record<string, any>;
    
    propsToFix.forEach(propName => {
      if (propName in props) {
        const propValue = props[propName as keyof Props];
        
        if (Array.isArray(propValue)) {
          fixedProps[propName] = propValue.map(item => 
            typeof item === 'object' && item !== null 
              ? createAutoConvertingProxy(item, 'to-camel') 
              : item
          );
        } else if (typeof propValue === 'object' && propValue !== null) {
          fixedProps[propName] = createAutoConvertingProxy(propValue, 'to-camel');
        }
      }
    });
    
    return React.createElement(Component, fixedProps as Props);
  };
}

// Helper function for fixing individual objects
export function autoFixProps<T extends Record<string, any>>(
  props: T,
  direction: 'to-camel' | 'to-snake' = 'to-camel'
): T {
  const fixedProps = { ...props } as Record<string, any>;
  
  for (const key in fixedProps) {
    const value = fixedProps[key];
    
    if (Array.isArray(value)) {
      fixedProps[key] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? createAutoConvertingProxy(item, direction) 
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      fixedProps[key] = createAutoConvertingProxy(value, direction);
    }
  }
  
  return fixedProps as T;
}
