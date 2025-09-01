import type { GameEntity } from "../js/entities/GameEntity.js";
import { PositionComponent } from "../js/entities/components/PositionComponent.js";
import { CollisionEvent, type CollidableComponent } from "../js/entities/components/CollidableComponent.js";
import type { SizeComponent } from "../js/entities/components/SizeComponent.js";

export class CollisionSystem {
  static update(collider: GameEntity, otherEntities: GameEntity[]): void {
    const posA = collider.getComponent<PositionComponent>("position");
    const sizeA = collider.getComponent<SizeComponent>("size");
    const collidableA = collider.getComponent<CollidableComponent>("collidable");
    if (!posA || !sizeA || !collidableA) return;

    otherEntities.forEach((entityB) => {
      if (entityB === collider || !entityB.getComponent<CollidableComponent>("collidable")) return;

      const posB = entityB.getComponent<PositionComponent>("position");
      const sizeB = entityB.getComponent<SizeComponent>("size");
      const collidableB = entityB.getComponent<CollidableComponent>("collidable");
      if (!posB || !sizeB || !collidableB) return;

      let collision: boolean = false;
      if (posA && posB) {
        collision =
          posA.x < posB.x + sizeB.width &&
          posA.x + sizeA.width > posB.x &&
          posA.y < posB.y + sizeB.height &&
          posA.y + sizeA.height > posB.y;
      }
      if (collision) {
        let collisionEvent: CollisionEvent = new CollisionEvent(collider, entityB);
        collidableA.collisionEvents.push(collisionEvent);
        collidableB.collisionEvents.push(collisionEvent);
      }
    });
  }

  static cleanup(entities: GameEntity[]) {
    entities.forEach((entity) => {
      const collidable = entity.getComponent<CollidableComponent>("collidable");
      if (collidable && collidable.collisionEvents.length > 0) {
        collidable.collisionEvents = [];
      }
    });
  }
}
