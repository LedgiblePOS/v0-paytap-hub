# Proper Implementation Sequence for New Features

To prevent TypeScript errors and ensure code quality, follow this implementation sequence for new features:

## 1. Define Types First

Always start by defining all necessary TypeScript types:

```typescript
// Database entity types (snake_case)
export interface NewEntity {
  id: string;
  user_id: string;
  created_at: string;
  // other fields...
}

// UI model types (camelCase)
export interface NewEntityModel {
  id: string;
  userId: string;
  createdAt: string;
  // other fields...
}
```

## 2. Create and Register Converters

After defining types, immediately create conversion functions:

```typescript
// Create converters in a dedicated file
export function toNewEntityModel(entity: NewEntity): NewEntityModel {
  return {
    id: entity.id,
    userId: entity.user_id,
    createdAt: entity.created_at,
    // other fields...
  };
}

export function toNewEntityEntity(model: NewEntityModel): NewEntity {
  return {
    id: model.id,
    user_id: model.userId,
    created_at: model.createdAt,
    // other fields...
  };
}

// Don't forget batch converters
export function toNewEntityModels(entities: NewEntity[]): NewEntityModel[] {
  return entities.map(toNewEntityModel);
}

export function toNewEntityEntities(models: NewEntityModel[]): NewEntity[] {
  return models.map(toNewEntityEntity);
}
```

Then register these converters in the main index file:

```typescript
// In modelConversions/index.ts
export {
  toNewEntityModel,
  toNewEntityEntity,
  toNewEntityModels,
  toNewEntityEntities
} from './newEntityConverters';
```

## 3. Create Database Tables/Schema

Before implementing any services, ensure the database tables exist:

```sql
CREATE TABLE new_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- other fields...
);
```

## 4. Implement Service Layer

Only after types, converters, and database tables are in place:

```typescript
import { supabase } from "@/integrations/supabase/client";
import { NewEntity, NewEntityModel } from "@/types/newEntity";
import { toNewEntityModel, toNewEntityEntity, toNewEntityModels } from "@/utils/modelConversions";

export const getNewEntities = async (userId: string): Promise<NewEntityModel[]> => {
  const { data, error } = await supabase
    .from('new_entities')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  return toNewEntityModels(data as NewEntity[]);
};
```

## 5. Implement UI Components

Finally, build UI components that use the models:

```tsx
import React from 'react';
import { NewEntityModel } from '@/types/newEntity';
import { useNewEntities } from '@/hooks/useNewEntities';

export const NewEntityList: React.FC = () => {
  const { data: entities, isLoading } = useNewEntities();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {entities.map(entity => (
        <div key={entity.id}>
          {entity.name} - Created: {new Date(entity.createdAt).toLocaleDateString()}
        </div>
      ))}
    </div>
  );
};
```

## Implementation Checklist

Before submitting code for review, ensure:

- [x] Types are defined (both entity and model)
- [x] Converters are created and registered
- [x] Database tables exist with matching structure
- [x] Services use proper conversion at boundaries
- [x] UI components use model types exclusively
- [x] Error handling is in place
- [x] Tests are written for critical paths

## Common Warning Signs

Watch for these red flags that indicate you may be implementing in the wrong order:

- You need to use `as` type assertions frequently
- You're encountering property access errors for snake_case/camelCase
- Your service layer contains manual property mapping instead of using converters
- You're getting TypeScript errors about missing exports

Following this implementation sequence will prevent most TypeScript errors and make your code more maintainable.
