
/**
 * Creates a set of converter functions for a specific entity/model pair
 */
export function createConverters<EntityType, ModelType>(
  toModelFn: (entity: EntityType) => ModelType,
  toEntityFn: (model: ModelType) => EntityType
) {
  return {
    toModel: toModelFn,
    toEntity: toEntityFn,
    toModels: (entities: EntityType[]): ModelType[] => entities.map(toModelFn),
    toEntities: (models: ModelType[]): EntityType[] => models.map(toEntityFn)
  };
}

/**
 * Utility to convert snake_case objects to camelCase
 */
export function convertObjectToCamelCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        result[camelKey] = convertObjectToCamelCase(obj[key]);
      } else if (Array.isArray(obj[key])) {
        result[camelKey] = obj[key].map((item: any) => 
          typeof item === 'object' && item !== null 
            ? convertObjectToCamelCase(item) 
            : item
        );
      } else {
        result[camelKey] = obj[key];
      }
    } else {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  });
  
  return result;
}

/**
 * Utility to convert camelCase objects to snake_case
 */
export function convertObjectToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        result[snakeKey] = convertObjectToSnakeCase(obj[key]);
      } else if (Array.isArray(obj[key])) {
        result[snakeKey] = obj[key].map((item: any) => 
          typeof item === 'object' && item !== null 
            ? convertObjectToSnakeCase(item) 
            : item
        );
      } else {
        result[snakeKey] = obj[key];
      }
    } else {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = obj[key];
    }
  });
  
  return result;
}

/**
 * Generic function to convert a snake_case entity to camelCase model
 */
export function entityToModel<EntityType extends Record<string, any>, ModelType>(
  entity: EntityType
): ModelType {
  return convertObjectToCamelCase(entity) as unknown as ModelType;
}

/**
 * Generic function to convert a camelCase model to snake_case entity
 */
export function modelToEntity<ModelType extends Record<string, any>, EntityType>(
  model: ModelType
): EntityType {
  return convertObjectToSnakeCase(model) as unknown as EntityType;
}
