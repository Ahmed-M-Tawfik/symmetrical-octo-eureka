import { GameEntity } from "./GameEntity.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { SizeComponent } from "./components/SizeComponent.js";
import { ColorComponent } from "./components/ColorComponent.js";
import { ShrinkComponent } from "./components/ShrinkComponent.js";
import { SpeedComponent } from "./components/SpeedComponent.js";
import type { IParticleConfig } from "../data/ConfigTypes.js";
import type { Game } from "../Main.js";
import { ImageComponent } from "./components/ImageComponent.js";
import { LifetimeComponent } from "./components/LifetimeComponent.js";
import { AssetManager } from "../systems/AssetManager.js";

// ECS-compliant Dust particle
export class Dust extends GameEntity {
  constructor(game: Game, x: number, y: number, cfg: IParticleConfig) {
    super(game);
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("size", new SizeComponent(size, size));
    this.addComponent("color", new ColorComponent(cfg.color ?? "black"));
    this.addComponent("shrink", new ShrinkComponent(cfg.shrink));
    this.addComponent("speed", new SpeedComponent(Math.random(), 0, Math.random(), 0));
    this.addComponent("lifetime", new LifetimeComponent(cfg.maxLifetime));
  }
}

// ECS-compliant Splash particle
export class Splash extends GameEntity {
  constructor(game: Game, x: number, y: number, cfg: IParticleConfig) {
    super(game);
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    this.addComponent("position", new PositionComponent(x - size * 0.4, y - size * 0.5));
    this.addComponent("size", new SizeComponent(size, size));
    this.addComponent("shrink", new ShrinkComponent(cfg.shrink));
    if (cfg.imageId) {
      this.addComponent("image", new ImageComponent(AssetManager.getImage(cfg.imageId)));
    }
    this.addComponent("lifetime", new LifetimeComponent(cfg.maxLifetime));

    const speedX =
      typeof cfg.speedX === "number"
        ? cfg.speedX
        : cfg.speedX && typeof cfg.speedX.min === "number" && typeof cfg.speedX.max === "number"
        ? Math.random() * (cfg.speedX.max - cfg.speedX.min) + cfg.speedX.min
        : 0;
    const speedY =
      typeof cfg.speedY === "number"
        ? cfg.speedY
        : cfg.speedY && typeof cfg.speedY.min === "number" && typeof cfg.speedY.max === "number"
        ? Math.random() * (cfg.speedY.max - cfg.speedY.min) + cfg.speedY.min
        : 0;
    this.addComponent("speed", new SpeedComponent(speedX, 0, speedY, 1));
  }
}

// ECS-compliant Fire particle
export class Fire extends GameEntity {
  constructor(game: Game, x: number, y: number, cfg: IParticleConfig) {
    super(game);
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("size", new SizeComponent(size, size));
    this.addComponent("shrink", new ShrinkComponent(cfg.shrink));
    if (cfg.imageId) {
      this.addComponent("image", new ImageComponent(AssetManager.getImage(cfg.imageId)));
    }
    this.addComponent("lifetime", new LifetimeComponent(cfg.maxLifetime));
    this.addComponent(
      "speed",
      new SpeedComponent(
        typeof cfg.speedX === "number" ? cfg.speedX : 1,
        0,
        typeof cfg.speedY === "number" ? cfg.speedY : 1,
        0
      )
    );
  }
}
