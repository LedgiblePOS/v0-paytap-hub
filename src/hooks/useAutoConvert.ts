
import { useState, useCallback } from 'react';
import { convertObjectToCamelCase, convertObjectToSnakeCase } from '@/utils/caseConversion';

/**
 * Hook to automatically convert between snake_case and camelCase
 * @param initialEntity The initial entity to convert
 * @returns State and update functions for both entity formats
 */
export function useAutoConvert<T extends Record<string, any>>(initialEntity?: T) {
  // Store the original entity format (likely snake_case from API)
  const [entity, setEntity] = useState<T | undefined>(initialEntity);
  
  // Store the UI-friendly camelCase version
  const [model, setModel] = useState<Record<string, any> | undefined>(
    initialEntity ? convertObjectToCamelCase(initialEntity) : undefined
  );

  /**
   * Update the entity with snake_case format
   * This will also update the model with a converted camelCase version
   */
  const updateEntity = useCallback((newEntity: T) => {
    setEntity(newEntity);
    setModel(convertObjectToCamelCase(newEntity));
  }, []);

  /**
   * Update the model with camelCase format
   * This will also update the entity with a converted snake_case version
   */
  const updateModel = useCallback((newModel: Record<string, any>) => {
    setModel(newModel);
    setEntity(convertObjectToSnakeCase(newModel) as T);
  }, []);

  /**
   * Reset both entity and model to initial values or undefined
   */
  const reset = useCallback((defaultEntity?: T) => {
    setEntity(defaultEntity);
    setModel(defaultEntity ? convertObjectToCamelCase(defaultEntity) : undefined);
  }, []);

  return {
    entity,
    model,
    updateEntity,
    updateModel,
    reset
  };
}

/**
 * Function to convert a snake_case entity to camelCase model
 */
export function entityToModel<T extends Record<string, any>>(entity: T): Record<string, any> {
  return convertObjectToCamelCase(entity);
}

/**
 * Function to convert a camelCase model to snake_case entity
 */
export function modelToEntity<T extends Record<string, any>>(model: T): Record<string, any> {
  return convertObjectToSnakeCase(model);
}

/**
 * Function to batch convert multiple entities to models
 */
export function entitiesToModels<T extends Record<string, any>>(entities: T[]): Record<string, any>[] {
  return entities.map(entity => convertObjectToCamelCase(entity));
}

/**
 * Function to batch convert multiple models to entities
 */
export function modelsToEntities<T extends Record<string, any>>(models: T[]): Record<string, any>[] {
  return models.map(model => convertObjectToSnakeCase(model));
}

/**
 * Custom hook that automatically converts data between models and entities
 * for forms, API calls, and other use cases
 */
export default useAutoConvert;
