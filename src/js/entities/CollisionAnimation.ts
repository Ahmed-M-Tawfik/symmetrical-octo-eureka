import type { Game } from "../Main.js";
import type { IGameConfig } from "../data/ConfigTypes.js";
import { AssetManager } from "../systems/AssetManager.js";
import { GameEntity } from "./GameEntity.js";
import { LifetimeComponent } from "./components/LifetimeComponent.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { SizeComponent } from "./components/SizeComponent.js";
import { SpeedComponent } from "./components/SpeedComponent.js";
import { SpriteComponent } from "./components/SpriteComponent.js";

export class CollisionAnimation extends GameEntity {
  constructor(game: Game, x: number, y: number, config: IGameConfig["collisionAnimation"]) {
    super(game);

    const sizeModifier = Math.random() * (config.sizeModifierMax - config.sizeModifierMin) + config.sizeModifierMin;
    const width = config.spriteWidth * sizeModifier;
    const height = config.spriteHeight * sizeModifier;

    this.addComponent("position", new PositionComponent(x - width * 0.5, y - height * 0.5));
    this.addComponent("size", new SizeComponent(width, height));
    this.addComponent("speed", new SpeedComponent(0, 0, 0, 0));
    const frameInterval = Math.random() * (config.frameIntervalMax - config.frameIntervalMin) + config.frameIntervalMin;
    this.addComponent("lifetime", new LifetimeComponent(frameInterval * config.maxFrame + 1));
    this.addComponent(
      "sprite",
      new SpriteComponent(
        0,
        0,
        config.maxFrame,
        frameInterval,
        config.spriteWidth,
        config.spriteHeight,
        AssetManager.getImage(config.imageId)
      )
    );
    console.log("Collision animation created");
  }
}
