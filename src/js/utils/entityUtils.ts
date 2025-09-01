import { MarkedForDeletionComponent } from "../entities/components/MarkedForDeletionComponent.js";
import type { GameEntity } from "../entities/GameEntity.js";

// add to given entity the markedForDeletion component
export function markEntityForDeletion(entity: GameEntity) {
  entity.addComponent("markedForDeletion", new MarkedForDeletionComponent());
}
