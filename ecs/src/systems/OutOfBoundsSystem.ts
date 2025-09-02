import { MarkedForDeletionComponent } from "../js/entities/components/MarkedForDeletionComponent.js";
import { DeleteIfOutOfBoundsComponent } from "../js/entities/components/DeleteIfOutOfBoundsComponent.js";
import type { PositionComponent } from "../js/entities/components/PositionComponent.js";
import type { SizeComponent } from "../js/entities/components/SizeComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";

export class OutOfBoundsSystem {
  static update(entities: GameEntity[]) {
    entities.forEach((entity) => {
      const pos = entity.getComponent<PositionComponent>("position");
      const bounds = entity.getComponent<DeleteIfOutOfBoundsComponent>("deleteIfOutOfBounds");
      const size = entity.getComponent<SizeComponent>("size");
      const width = size ? size.width : 0;
      const height = size ? size.height : 0;

      if (pos && bounds) {
        if (
          (bounds.leftBound !== undefined && pos.x + width < bounds.leftBound) || // width to ensure off screen
          (bounds.rightBound !== undefined && pos.x > bounds.rightBound) ||
          (bounds.topBound !== undefined && pos.y + height < bounds.topBound) ||
          (bounds.bottomBound !== undefined && pos.y > bounds.bottomBound)
        ) {
          entity.addComponent("markedForDeletion", new MarkedForDeletionComponent());
        }
      }
    });
  }
}
