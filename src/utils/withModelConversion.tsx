
import React from 'react';
import { entityToModel, modelToEntity } from './modelConverter';

/**
 * HOC that automatically converts entity props to model props
 * 
 * @param Component The component to wrap
 * @param propNames Array of prop names that should be converted from entities to models
 * @returns A wrapped component that automatically converts entity props to model props
 */
export function withEntityToModelConversion<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  propNames: (keyof P)[]
): React.FC<P> {
  return (props: P) => {
    const convertedProps = { ...props } as any;
    
    for (const propName of propNames) {
      if (propName in props) {
        const value = props[propName as keyof P];
        
        if (Array.isArray(value)) {
          // Convert array of entities to array of models
          convertedProps[propName] = value.map((item: any) => entityToModel(item));
        } else if (value && typeof value === 'object') {
          // Convert single entity to model
          convertedProps[propName] = entityToModel(value);
        }
      }
    }
    
    return <Component {...convertedProps} />;
  };
}

/**
 * HOC that automatically converts model props to entity props
 * 
 * @param Component The component to wrap
 * @param propNames Array of prop names that should be converted from models to entities
 * @returns A wrapped component that automatically converts model props to entity props
 */
export function withModelToEntityConversion<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  propNames: (keyof P)[]
): React.FC<P> {
  return (props: P) => {
    const convertedProps = { ...props } as any;
    
    for (const propName of propNames) {
      if (propName in props) {
        const value = props[propName as keyof P];
        
        if (Array.isArray(value)) {
          // Convert array of models to array of entities
          convertedProps[propName] = value.map((item: any) => modelToEntity(item));
        } else if (value && typeof value === 'object') {
          // Convert single model to entity
          convertedProps[propName] = modelToEntity(value);
        }
      }
    }
    
    return <Component {...convertedProps} />;
  };
}
