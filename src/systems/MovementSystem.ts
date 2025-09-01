import type { Game } from "../js/Main.js";
import type { GameEntity } from "../js/entities/GameEntity.js";
import type { CustomMovementComponent } from "../js/entities/components/CustomMovementComponent.js";
import { PositionComponent } from "../js/entities/components/PositionComponent.js";
import type { SpeedComponent } from "../js/entities/components/SpeedComponent.js";
import { scaledDeltaTime } from "../js/utils/timeUtils.js";

export class MovementSystem {
  static update(game: Game, entities: GameEntity[], deltaTime: number) {
    for (const entity of entities) {
      const pos = entity.getComponent<PositionComponent>("position");
      const speed = entity.getComponent<SpeedComponent>("speed");
      if (!pos || !speed) return;

      const customMovement = entity.getComponent<CustomMovementComponent>("customMovement");
      if (customMovement) {
        customMovement.movementLogic(game, entity, deltaTime);
      } else {
        MovementSystem.standardMovementLogic(pos, speed, game, deltaTime);
      }
    }
  }

  private static standardMovementLogic(pos: PositionComponent, speed: SpeedComponent, game: Game, deltaTime: number) {
    const scaled = scaledDeltaTime(game, deltaTime);

    speed.speedY += speed.weight * scaled;

    pos.x -= (speed.speedX + game.speed) * scaled;
    pos.y += speed.speedY * scaled;
  }
}
