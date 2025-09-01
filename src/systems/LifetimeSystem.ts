import type { LifetimeComponent } from "../js/entities/components/LifetimeComponent.js";
import { MarkedForDeletionComponent } from "../js/entities/components/MarkedForDeletionComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";

export class LifetimeSystem {
  static update(entities: GameEntity[], deltaTime: number) {
    for (const entity of entities) {
      const lifetime = entity.getComponent<LifetimeComponent>("lifetime");
      if (lifetime) {
        if (lifetime) {
          lifetime.elapsedLifetimeMs += deltaTime;
          if (lifetime.elapsedLifetimeMs > lifetime.maxLifetimeMs)
            entity.addComponent("markedForDeletion", new MarkedForDeletionComponent());
        }
      }
    }
  }
}
