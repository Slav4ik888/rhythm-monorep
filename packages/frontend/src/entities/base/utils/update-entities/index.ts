
import { updateObject } from 'shared/helpers/objects';

export type Item = {
  id: string
  [key: string]: any
}

export type PartialItem = Partial<Item> & { id: string }

export interface Entities<T extends Item> {
  [key: string]: T
}

/**
 * v.2025-06-09
 * Adds new items into the entities & updates existing ones
 * В Partial<T> обязательно id
 */
export function updateEntities<T extends Item>(
  entities : Entities<T>,
  payload  : PartialItem[] = []
): Entities<T> {
  return {
    ...entities,
    ...payload.reduce((acc: Entities<T>, partialEntity: PartialItem) => {
      if (! partialEntity.id) return {}

      acc[partialEntity.id] = {
        ...(entities[partialEntity.id]
          // Если сущность с таким id уже существует, мержим изменения
          ? updateObject(entities[partialEntity.id], partialEntity)
          : partialEntity as T),
      };
      return acc;
    }, {})
  };
}

// export function addEntities<T extends Item>(entities: Entities<T>, payload: T[] = []): Entities<T> {
//   return {
//     ...entities,
//     ...payload.reduce((acc: Entities<T>, entity: T) => {
//       acc[entity.id] = entity;
//       return acc;
//     }, {})
//   }
// }
