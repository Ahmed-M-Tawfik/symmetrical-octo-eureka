import type { Game } from "../Main.js";
import type { IGameConfig } from "../data/ConfigTypes.js";
import { scaledDeltaTime } from "../utils/timeUtils.js";
import { GameEntity } from "./GameEntity.js";
import { CustomDrawComponent } from "./components/CustomDrawComponent.js";
import { CustomMovementComponent } from "./components/CustomMovementComponent.js";
import { LifetimeComponent } from "./components/LifetimeComponent.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { TargetPositionComponent } from "./components/TargetPositionComponent.js";
import { ValueComponent } from "./components/ValueComponent.js";

export class FloatingMessage extends GameEntity {
  constructor(game: Game, value: string, x: number, y: number, cfg: IGameConfig["floatingMessage"]) {
    super(game);
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("targetPosition", new TargetPositionComponent(cfg.targetX, cfg.targetY));
    this.addComponent("value", new ValueComponent(value));
    this.addComponent("lifetime", new LifetimeComponent(cfg.duration));
    this.addComponent("customMovement", new CustomMovementComponent(floatingMessageMove));
    this.addComponent("customDraw", new CustomDrawComponent(floatingMessageDraw));
  }
}

function floatingMessageMove(game: Game, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const target = entity.getComponent<TargetPositionComponent>("targetPosition");
  if (!pos || !target) return;

  const scaled = scaledDeltaTime(game, deltaTime);
  pos.x += (target.x - pos.x) * 0.03 * scaled;
  pos.y += (target.y - pos.y) * 0.03 * scaled;
}

function floatingMessageDraw(game: Game, context: CanvasRenderingContext2D, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const value = entity.getComponent<ValueComponent>("value");
  if (!pos || !value) return;

  context.save();
  context.font = "20px Creepster";
  context.fillStyle = "white";
  context.fillText(value.value, pos.x, pos.y);
  context.fillStyle = "black";
  context.fillText(value.value, pos.x - 2, pos.y - 2);
  context.restore();
}
