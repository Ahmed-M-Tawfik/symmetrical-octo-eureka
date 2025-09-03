import { GameEntity } from "./GameEntity.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { SizeComponent } from "./components/SizeComponent.js";
import type { Game } from "../Main.js";
import { ENEMY_CONFIG } from "../data/GameConfig.js";
import { AssetManager } from "../systems/AssetManager.js";
import { eventBus } from "../engine/EventBus.js";
import type { IEnemyConfig } from "../data/ConfigTypes.js";
import { scaledDeltaTime } from "../utils/timeUtils.js";
import { markEntityForDeletion } from "../utils/entityUtils.js";
import { SpriteComponent } from "./components/SpriteComponent.js";
import { SpeedComponent } from "./components/SpeedComponent.js";
import { DeleteIfOutOfBoundsComponent } from "./components/DeleteIfOutOfBoundsComponent.js";
import { CustomMovementComponent } from "./components/CustomMovementComponent.js";
import { CustomDrawComponent } from "./components/CustomDrawComponent.js";
import { CollidableComponent } from "./components/CollidableComponent.js";
import { EnemyComponent } from "./components/EnemyComponent.js";

export class Enemy extends GameEntity {
  constructor(game: Game, cfg: IEnemyConfig, x: number, y: number) {
    super(game);
    this.addComponent("enemy", new EnemyComponent(cfg.imageId));
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("size", new SizeComponent(cfg.width, cfg.height));
    this.addComponent("deleteIfOutOfBounds", new DeleteIfOutOfBoundsComponent(0, undefined, undefined, undefined));
    this.addComponent(
      "sprite",
      new SpriteComponent(
        0,
        0,
        cfg.maxFrame,
        1000 / cfg.fps,
        cfg.spriteWidth,
        cfg.spriteHeight,
        AssetManager.getImage(cfg.imageId)
      )
    );
    this.addComponent("collidable", new CollidableComponent());
    eventBus.on("enemy:collidedWithPlayer", (data) => {
      if (data.enemies.includes(this)) {
        markEntityForDeletion(this);
      }
    });
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game: Game, x?: number, y?: number, speedX?: number, va?: number) {
    const cfg = ENEMY_CONFIG["flying"];
    if (!cfg) throw new Error("Flying enemy config not found");

    const spawnX = x !== undefined ? x : game.width + Math.random() * cfg.width * 0.5;
    const spawnY = y !== undefined ? y : Math.random() * game.height * 0.5;
    super(game, cfg, spawnX, spawnY);

    if (va !== undefined) {
      va = va;
    } else if (typeof cfg.va === "number") {
      va = cfg.va;
    } else if (cfg.va && typeof cfg.va.min === "number" && typeof cfg.va.max === "number") {
      va = Math.random() * (cfg.va.max - cfg.va.min) + cfg.va.min;
    } else {
      throw new Error("Invalid va configuration for FlyingEnemy");
    }
    this.addComponent(
      "customMovement",
      new CustomMovementComponent(customMovementFlyingEnemy, {
        angle: 0,
        angleSpeed: va,
      })
    );

    if (speedX !== undefined) {
      speedX = speedX;
    } else if (typeof cfg.speedX === "number") {
      speedX = cfg.speedX;
    } else if (cfg.speedX && typeof cfg.speedX.min === "number" && typeof cfg.speedX.max === "number") {
      speedX = Math.random() * (cfg.speedX.max - cfg.speedX.min) + cfg.speedX.min;
    } else {
      throw new Error("Invalid speedX configuration for FlyingEnemy");
    }
    let speedY = 0;
    this.addComponent("speed", new SpeedComponent(speedX, 0, speedY, 0));
  }
}

function customMovementFlyingEnemy(game: Game, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const size = entity.getComponent<SizeComponent>("size");
  const speed = entity.getComponent<SpeedComponent>("speed");
  const customMovement = entity.getComponent<CustomMovementComponent>("customMovement");
  if (!pos || !size || !speed || !customMovement) return;

  const scaled = scaledDeltaTime(game, deltaTime);

  pos.x -= (speed.speedX + game.speed) * scaled;
  pos.y += speed.speedY * scaled;

  customMovement.customMovementState["angle"] += customMovement.customMovementState["angleSpeed"] * scaled;
  pos.y += Math.sin(customMovement.customMovementState["angle"]) * 2 * scaled;
}

export class GroundEnemy extends Enemy {
  constructor(game: Game) {
    const cfg = ENEMY_CONFIG["ground"];
    if (!cfg) throw new Error("Ground enemy config not found");

    const x = game.width;
    const y = game.height - cfg.height - game.groundMargin;
    super(game, cfg, x, y);

    let speedX = typeof cfg.speedX === "number" ? cfg.speedX : 0;
    let speedY = 0;
    this.addComponent("speed", new SpeedComponent(speedX, 0, speedY, 0));
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game: Game) {
    const cfg = ENEMY_CONFIG["climbing"];
    if (!cfg) throw new Error("Climbing enemy config not found");

    const x = game.width;
    const y = Math.random() * game.height * 0.5;
    super(game, cfg, x, y);

    let speedX = typeof cfg.speedX === "number" ? cfg.speedX : 0;
    let speedY = Math.random() > 0.5 ? 1 : -1;
    this.addComponent("speed", new SpeedComponent(speedX, 0, speedY, 0));
    this.addComponent("customMovement", new CustomMovementComponent(customMovementClimbingEnemy));
    this.addComponent("customDraw", new CustomDrawComponent(customDrawClimbingEnemy));
  }
}

function customMovementClimbingEnemy(game: Game, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const speed = entity.getComponent<SpeedComponent>("speed");
  const size = entity.getComponent<SizeComponent>("size");
  if (!pos || !speed || !size) return;

  const scaled = scaledDeltaTime(game, deltaTime);
  pos.x -= (speed.speedX + game.speed) * scaled;
  pos.y += speed.speedY * scaled;

  if (pos.y < 0 || pos.y > game.height - size.height - game.groundMargin) {
    speed.speedY *= -1;
  }
}

function customDrawClimbingEnemy(game: Game, context: CanvasRenderingContext2D, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const sprite = entity.getComponent<SpriteComponent>("sprite");
  const size = entity.getComponent<SizeComponent>("size");
  if (!pos || !sprite || !size) return;

  context.save();
  // Draw the web line
  context.beginPath();
  context.moveTo(pos.x + size.width * 0.5, 0);
  context.lineTo(pos.x + size.width * 0.5, pos.y + 50);
  context.stroke();
  context.restore();

  context.drawImage(
    sprite.image,
    sprite.frameX * sprite.spriteWidth,
    sprite.frameY * sprite.spriteHeight,
    sprite.spriteWidth,
    sprite.spriteHeight,
    pos.x,
    pos.y,
    size.width,
    size.height
  );
}
