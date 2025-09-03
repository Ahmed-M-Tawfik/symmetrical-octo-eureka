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
import type { PowerupComponent } from "../js/entities/components/PowerupComponent.js";

export class InteractionSystem {
  static update(game: Game, entities: GameEntity[]) {
    entities.forEach((entity) => {
      if (!entity.getComponent<CollidableComponent>("collidable")) return;

      const collidable = entity.getComponent<CollidableComponent>("collidable");
      if (!collidable) return;

      collidable.collisionEvents
        .filter((collisionEvent) => entity === collisionEvent.collider)
        .forEach((collisionEvent) => {
          const collidedWithEntity = collisionEvent.collidedWith;

          // Powerup collection logic
          const powerup = collidedWithEntity.getComponent<PowerupComponent>("powerup");
          if (powerup && collisionEvent.collider.getComponent<PlayerComponent>("player")) {
            this.handlePowerupCollision(game, collisionEvent);
          }

          const enemy = collidedWithEntity.getComponent<EnemyComponent>("enemy");
          if (enemy && collisionEvent.collider.getComponent<PlayerComponent>("player")) {
            this.handleEnemyCollision(game, collisionEvent);
          }
        });
    });
  }

  private static handlePowerupCollision(game: Game, collisionEvent: CollisionEvent) {
    // Get position for floating message
    const pos = collisionEvent.collidedWith.getComponent<PositionComponent>("position");
    const powerup = collisionEvent.collidedWith.getComponent<PowerupComponent>("powerup");
    if (!pos || !powerup) return;

    // Apply powerup effect
    if (powerup.type === "life") {
      game.session.lives += powerup.value;
      // Optionally clamp max lives if needed
      if (pos) {
        game.session.entities.push(
          new FloatingMessage(game, `+${powerup.value} Life`, pos.x, pos.y, GAME_CONFIG.floatingMessage)
        );
      }
    } else if (powerup.type === "score") {
      game.session.score += powerup.value;
      if (pos) {
        game.session.entities.push(
          new FloatingMessage(game, `+${powerup.value} Score`, pos.x, pos.y, GAME_CONFIG.floatingMessage)
        );
      }
    }

    // Mark powerup for deletion
    collisionEvent.collidedWith.addComponent("markedForDeletion", new MarkedForDeletionComponent());
  }

  private static handleEnemyCollision(game: Game, collisionEvent: CollisionEvent) {
    const player = collisionEvent.collider.getComponent<PlayerComponent>("player");
    if (!player) return;

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

    collisionEvent.collidedWith.addComponent("markedForDeletion", new MarkedForDeletionComponent());
  }
}
