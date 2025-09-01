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
    for (const entity of entities.filter((e) => e.getComponent<CollidableComponent>("collidable"))) {
      const collidable = entity.getComponent<CollidableComponent>("collidable");
      if (!collidable) continue;

      for (const collisionEvent of collidable.collisionEvents) {
        const entity = collisionEvent.collidedWith;
        if (entity.getComponent<EnemyComponent>("enemy"))
          entity.addComponent("markedForDeletion", new MarkedForDeletionComponent());

        if (collisionEvent.collider.getComponent<PlayerComponent>("player")) {
          this.handlePlayerCollision(game, collisionEvent);
        }
      }
    }
  }

  private static handlePlayerCollision(game: Game, collisionEvent: CollisionEvent) {
    const player = collisionEvent.collider.getComponent<PlayerComponent>("player");
    if (player) {
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
