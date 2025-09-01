import type { MarkedForDeletionComponent } from "../js/entities/components/MarkedForDeletionComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";

export class DeletionSystem {
  static update(entities: GameEntity[]) {
    for (const entity of entities) {
      const isMarkedForDeletion = entity.getComponent<MarkedForDeletionComponent>("markedForDeletion") != undefined;

      if (isMarkedForDeletion) {
        const index = entities.indexOf(entity);
        if (index > -1) {
          entities.splice(index, 1);
        }
      }
    }
  }
}
