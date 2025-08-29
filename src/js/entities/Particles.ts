import { GameEntity } from "./GameEntity.js";
import type { Game } from "../Main.js";
import { PARTICLE_CONFIG } from "../data/GameConfig.js";
import { AssetManager } from "../systems/AssetManager.js";
import { scaleDecayFactor, scaleDeltaTime } from "../utils/timeUtils.js";

export class Dust extends GameEntity {
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  shrink: number;

  // optimization to calculate shrink speed per frame only once:
  private shrinkSpeed: number;
  private shrinkSpeedUsedDeltaTime: number;

  constructor(game: Game, x: number, y: number) {
    const cfg = PARTICLE_CONFIG["dust"];
    if (!cfg) throw new Error("Dust particle config not found");
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    super(game, x, y, size, size);
    this.size = size;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = cfg.color === undefined ? "black" : cfg.color;
    this.shrink = cfg.shrink;

    this.shrinkSpeed = 0;
    this.shrinkSpeedUsedDeltaTime = 0;
  }

  override update(deltaTime: number): void {
    const scaled = scaleDeltaTime(deltaTime, this.game);
    this.x -= (this.speedX + this.game.speed) * scaled;
    this.y -= this.speedY * scaled;

    // optimize to not do Math.pow 30 times per frame...
    if (this.shrinkSpeedUsedDeltaTime !== deltaTime) {
      this.shrinkSpeed = scaleDecayFactor(this.shrink, deltaTime, this.game);
      this.shrinkSpeedUsedDeltaTime = deltaTime;
    }
    this.size *= this.shrinkSpeed;
    if (this.size < 0.5) this.markedForDeletion = true;
  }

  override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
}

export class Splash extends GameEntity {
  image: HTMLImageElement;
  size: number;
  speedX: number;
  speedY: number;
  decelRate: number;
  shrink: number;
  gravity: number;

  // optimization to calculate shrink speed per frame only once:
  private shrinkSpeed: number;
  private shrinkSpeedUsedDeltaTime: number;

  constructor(game: Game, x: number, y: number) {
    const cfg = PARTICLE_CONFIG["splash"];
    if (!cfg) throw new Error("Splash particle config not found");
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    super(game, x - size * 0.4, y - size * 0.5, size, size);
    if (!cfg.imageId) throw new Error("Missing imageId for Splash particle config");
    this.image = AssetManager.getImage(cfg.imageId);
    this.size = size;
    this.speedX =
      typeof cfg.speedX === "number"
        ? cfg.speedX
        : Math.random() * (cfg.speedX!.max - cfg.speedX!.min) + cfg.speedX!.min;
    this.speedY =
      typeof cfg.speedY === "number"
        ? cfg.speedY
        : Math.random() * (cfg.speedY!.max - cfg.speedY!.min) + cfg.speedY!.min;
    this.decelRate = 0;
    this.shrink = cfg.shrink;
    this.gravity = cfg.gravity ?? 0.1;

    this.shrinkSpeed = 0;
    this.shrinkSpeedUsedDeltaTime = 0;
  }

  override update(deltaTime: number): void {
    const scaled = scaleDeltaTime(deltaTime, this.game);
    this.x -= (this.speedX + this.game.speed) * scaled;
    this.y -= this.speedY * scaled;

    this.decelRate += this.gravity * scaled;
    this.y += this.decelRate * scaled;

    // optimize to not do Math.pow 30 times per frame...
    if (this.shrinkSpeedUsedDeltaTime !== deltaTime) {
      this.shrinkSpeed = scaleDecayFactor(this.shrink, deltaTime, this.game);
      this.shrinkSpeedUsedDeltaTime = deltaTime;
    }
    this.size *= this.shrinkSpeed;
    if (this.size < 0.5) this.markedForDeletion = true;
  }

  override draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

export class Fire extends GameEntity {
  image: HTMLImageElement;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  shrink: number;
  va: number;

  // optimization to calculate shrink speed per frame only once:
  private shrinkSpeed: number;
  private shrinkSpeedUsedDeltaTime: number;

  constructor(game: Game, x: number, y: number) {
    const cfg = PARTICLE_CONFIG["fire"];
    if (!cfg) throw new Error("Fire particle config not found");
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    super(game, x, y, size, size);
    if (!cfg.imageId) throw new Error("Missing imageId for Fire particle config");
    this.image = AssetManager.getImage(cfg.imageId);
    this.size = size;
    this.speedX = typeof cfg.speedX === "number" ? cfg.speedX : 1;
    this.speedY = typeof cfg.speedY === "number" ? cfg.speedY : 1;
    this.angle = 0;
    this.shrink = cfg.shrink;
    this.va = typeof cfg.va === "number" ? cfg.va : Math.random() * (cfg.va!.max - cfg.va!.min) + cfg.va!.min;

    this.shrinkSpeed = 0;
    this.shrinkSpeedUsedDeltaTime = 0;
  }

  override update(deltaTime: number): void {
    const scaled = scaleDeltaTime(deltaTime, this.game);
    this.x -= (this.speedX + this.game.speed) * scaled;
    this.y -= this.speedY * scaled;

    // optimize to not do Math.pow 30 times per frame...
    if (this.shrinkSpeedUsedDeltaTime !== deltaTime) {
      this.shrinkSpeed = scaleDecayFactor(this.shrink, deltaTime, this.game);
      this.shrinkSpeedUsedDeltaTime = deltaTime;
    }
    this.size *= this.shrinkSpeed;
    if (this.size < 0.5) this.markedForDeletion = true;

    this.angle += this.va * scaled;
    this.x += Math.sin(this.angle * 10) * scaled;
  }

  override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    context.restore();
  }
}
