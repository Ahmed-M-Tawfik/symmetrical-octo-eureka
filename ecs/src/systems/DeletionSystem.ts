import type { MarkedForDeletionComponent } from "../js/entities/components/MarkedForDeletionComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";

export class DeletionSystem {
  static update(entities: GameEntity[]) {
    // Collect entities to delete
    const toDelete: GameEntity[] = [];
    entities.forEach((entity) => {
      const isMarkedForDeletion = entity.getComponent<MarkedForDeletionComponent>("markedForDeletion") != undefined;
      if (isMarkedForDeletion) {
        toDelete.push(entity);
      }
    });
    // Remove entities after iteration
    toDelete.forEach((entity) => {
      const index = entities.indexOf(entity);
      if (index > -1) {
        entities.splice(index, 1);
      }
    });
  }
}
