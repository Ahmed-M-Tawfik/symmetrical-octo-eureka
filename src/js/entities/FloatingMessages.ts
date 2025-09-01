import { GameEntity } from "./GameEntity.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { TargetPositionComponent } from "./components/TargetPositionComponent.js";
import { ValueComponent } from "./components/ValueComponent.js";
import type { Game } from "../Main.js";
import { LifetimeComponent } from "./components/LifetimeComponent.js";
import type { IGameConfig } from "../data/ConfigTypes.js";

export class FloatingMessage extends GameEntity {
  constructor(game: Game, value: string, x: number, y: number, cfg: IGameConfig["floatingMessage"]) {
    super(game);
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("targetPosition", new TargetPositionComponent(cfg.targetX, cfg.targetY));
    this.addComponent("value", new ValueComponent(value));
    this.addComponent("lifetime", new LifetimeComponent(cfg.duration));
  }
}
