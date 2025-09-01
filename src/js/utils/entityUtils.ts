import { MarkedForDeletionComponent } from "../entities/components/MarkedForDeletionComponent.js";
import type { GameEntity } from "../entities/GameEntity.js";

// add to given entity the markedForDeletion component
export function markEntityForDeletion(entity: GameEntity) {
  entity.addComponent("markedForDeletion", new MarkedForDeletionComponent());
}

// return a map of game entity types and number of each in a given array
export function countEntityTypes(entities: GameEntity[]): Map<string, number> {
  const typeCount = new Map<string, number>();
  for (const entity of entities) {
    const type = entity.constructor.name;
    typeCount.set(type, (typeCount.get(type) || 0) + 1);
  }
  return typeCount;
}
