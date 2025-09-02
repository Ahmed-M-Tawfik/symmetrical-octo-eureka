import { GAME_CONFIG } from "../js/data/GameConfig.js";
import type { CollidableComponent, CollisionEvent } from "../js/entities/components/CollidableComponent.js";
import type { EnemyComponent } from "../js/entities/components/EnemyComponent.js";
import { MarkedForDeletionComponent } from "../js/entities/components/MarkedForDeletionComponent.js";
import { PlayerComponent, PlayerState } from "../js/entities/components/PlayerComponent.js";
import { PlayerStateChangeRequestComponent } from "../js/entities/components/PlayerStateChangeRequestComponent.js";
import type { PositionComponent } from "../js/entities/components/PositionComponent.js";
import { FloatingMessage } from "../js/entities/FloatingMessages.js";
import type { GameEntity } from "../js/entities/GameEntity.js";
import type { Game } from "../js/Main.js";

export class InteractionSystem {
  static update(game: Game, entities: GameEntity[]) {
    entities.forEach((entity) => {
      if (!entity.getComponent<CollidableComponent>("collidable")) return;

      const collidable = entity.getComponent<CollidableComponent>("collidable");
      if (!collidable) return;

      collidable.collisionEvents.forEach((collisionEvent) => {
        const collidedWithEntity = collisionEvent.collidedWith;

        if (collidedWithEntity.getComponent<EnemyComponent>("enemy")) {
          collidedWithEntity.addComponent("markedForDeletion", new MarkedForDeletionComponent());
        }

        if (collisionEvent.collider.getComponent<PlayerComponent>("player")) {
          this.handlePlayerCollision(game, entity, collisionEvent);
        }
      });
    });
  }

  private static handlePlayerCollision(game: Game, currentEntity: GameEntity, collisionEvent: CollisionEvent) {
    const player = collisionEvent.collider.getComponent<PlayerComponent>("player");
    if (player && currentEntity === collisionEvent.collider) {
      if (player.currentState === PlayerState.ROLLING || player.currentState === PlayerState.DIVING) {
        const enemyPos = collisionEvent.collidedWith.getComponent<PositionComponent>("position");
        if (enemyPos) {
          game.session.score++;
          game.session.entities.push(
            new FloatingMessage(game, "+1", enemyPos.x, enemyPos.y, GAME_CONFIG.floatingMessage)
          );
        }
      } else {
        collisionEvent.collider.addComponent(
          "stateChangeRequest",
          new PlayerStateChangeRequestComponent(PlayerState.HIT)
        );
        game.session.lives--;
      }
    }
  }
}
