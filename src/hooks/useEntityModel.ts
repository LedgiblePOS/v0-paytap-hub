
import { useState, useEffect, useCallback } from 'react';

type ModelType = Record<string, any>;
type EntityType = Record<string, any>;

// Transform entity object (snake_case) to model object (camelCase)
const entityToModel = (entity: EntityType): ModelType => {
  const model: ModelType = {};
  
  Object.keys(entity).forEach(key => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    model[camelKey] = entity[key];
  });
  
  return model;
};

// Transform model object (camelCase) to entity object (snake_case) 
const modelToEntity = (model: ModelType): EntityType => {
  const entity: EntityType = {};
  
  Object.keys(model).forEach(key => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    entity[snakeKey] = model[key];
  });
  
  return entity;
};

// Transform arrays
const entitiesToModels = (entities: EntityType[]): ModelType[] => {
  return entities.map(entityToModel);
};

const modelsToEntities = (models: ModelType[]): EntityType[] => {
  return models.map(modelToEntity);
};

interface UseEntityModelOptions {
  initialData?: ModelType | ModelType[];
}

export function useEntityModel<E extends EntityType, M extends ModelType>(options: UseEntityModelOptions = {}) {
  const [model, setModel] = useState<M | M[] | null>(options.initialData as M | M[] || null);
  
  const updateFromEntity = useCallback((entityData: E | E[] | null) => {
    if (!entityData) {
      setModel(null);
      return;
    }
    
    if (Array.isArray(entityData)) {
      setModel(entitiesToModels(entityData) as M[]);
    } else {
      setModel(entityToModel(entityData) as M);
    }
  }, []);
  
  const getEntity = useCallback((): E | E[] | null => {
    if (!model) return null;
    
    if (Array.isArray(model)) {
      return modelsToEntities(model) as E[];
    }
    
    return modelToEntity(model) as E;
  }, [model]);
  
  // Update model state when initialData changes
  useEffect(() => {
    if (options.initialData) {
      setModel(options.initialData as M | M[]);
    }
  }, [options.initialData]);
  
  return {
    model,
    setModel,
    updateFromEntity,
    getEntity
  };
}

export default useEntityModel;

// Export utility functions
export {
  entityToModel,
  modelToEntity,
  entitiesToModels,
  modelsToEntities
};
