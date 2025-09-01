import type { PositionComponent } from "../js/entities/components/PositionComponent.js";
import type { TargetPositionComponent } from "../js/entities/components/TargetPositionComponent.js";
import type { ValueComponent } from "../js/entities/components/ValueComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";
import type { Game } from "../js/Main.js";
import { scaledDeltaTime } from "../js/utils/timeUtils.js";

export function FloatingMessageSystem(game: Game, entity: GameEntity, deltaTime: number) {
  // ECS update logic for floating messages
  const pos = entity.getComponent<PositionComponent>("position");
  const target = entity.getComponent<TargetPositionComponent>("targetPosition");
  const scaled = scaledDeltaTime(game, deltaTime);

  // Move towards target position if present
  if (pos && target) {
    pos.x += (target.x - pos.x) * 0.03 * scaled;
    pos.y += (target.y - pos.y) * 0.03 * scaled;
  }
}

export function FloatingMessageRenderSystem(context: CanvasRenderingContext2D, entity: GameEntity) {
  // ECS draw logic for floating messages
  const pos = entity.getComponent<PositionComponent>("position");
  const value = entity.getComponent<ValueComponent>("value");
  if (pos && value) {
    context.save();
    context.font = "20px Creepster";
    context.fillStyle = "white";
    context.fillText(value.value, pos.x, pos.y);
    context.fillStyle = "black";
    context.fillText(value.value, pos.x - 2, pos.y - 2);
    context.restore();
  }
}
