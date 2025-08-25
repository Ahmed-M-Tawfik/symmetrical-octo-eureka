import { SpriteData } from "../SpriteData.js";
import { GameEntity } from "./GameEntity.js";
import type { Game } from "../Main.js";
import { ENEMY_CONFIG } from "../data/GameConfig.js";
import type { ISpriteAnimatable } from "../systems/SpriteAnimator.js";

export class FlyingEnemy extends GameEntity implements ISpriteAnimatable {
  spriteData: SpriteData;
  speedX: number;
  speedY: number;
  angle: number;
  va: number;

  constructor(game: Game, x?: number, y?: number, speedX?: number, va?: number) {
    const cfg = ENEMY_CONFIG["flying"];
    const spawnX = x !== undefined ? x : game.width + Math.random() * game.width * 0.5;
    const spawnY = y !== undefined ? y : Math.random() * game.height * 0.5;
    super(game, spawnX, spawnY, cfg.width, cfg.height);

    this.spriteData = new SpriteData(game, 20);
    this.spriteData.spriteWidth = cfg.spriteWidth;
    this.spriteData.spriteHeight = cfg.spriteHeight;
    this.spriteData.maxFrame = cfg.maxFrame;
    this.spriteData.image = document.getElementById(cfg.imageId) as HTMLImageElement;

    if (speedX !== undefined) {
      this.speedX = speedX;
    } else if (typeof cfg.speedX === "number") {
      this.speedX = cfg.speedX;
    } else {
      this.speedX = Math.random() * (cfg.speedX.max - cfg.speedX.min) + cfg.speedX.min;
    }
    this.speedY = 0;

    this.angle = 0;
    if (va !== undefined) {
      this.va = va;
    } else if (typeof cfg.va === "number") {
      this.va = cfg.va;
    } else {
      this.va = Math.random() * (cfg.va.max - cfg.va.min) + cfg.va.min;
    }
  }

  override update(deltaTime: number): void {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;

    this.angle += this.va;
    this.y += Math.sin(this.angle) * 2;
  }
}

export class GroundEnemy extends GameEntity implements ISpriteAnimatable {
  spriteData: SpriteData;
  speedX: number;
  speedY: number;

  constructor(game: Game) {
    const cfg = ENEMY_CONFIG["ground"];
    const x = game.width;
    const y = game.height - cfg.height - game.groundMargin;
    super(game, x, y, cfg.width, cfg.height);

    this.spriteData = new SpriteData(game, 20);
    this.spriteData.spriteWidth = cfg.spriteWidth;
    this.spriteData.spriteHeight = cfg.spriteHeight;
    this.spriteData.image = document.getElementById(cfg.imageId) as HTMLImageElement;
    this.spriteData.maxFrame = cfg.maxFrame;

    this.speedX = typeof cfg.speedX === "number" ? cfg.speedX : 0;
    this.speedY = 0;
  }

  override update(deltaTime: number): void {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }
}

export class ClimbingEnemy extends GameEntity implements ISpriteAnimatable {
  spriteData: SpriteData;
  speedX: number;
  speedY: number;

  constructor(game: Game) {
    const cfg = ENEMY_CONFIG["climbing"];
    const x = game.width;
    const y = Math.random() * game.height * 0.5;
    super(game, x, y, cfg.width, cfg.height);

    this.spriteData = new SpriteData(game, 20);
    this.spriteData.spriteWidth = cfg.spriteWidth;
    this.spriteData.spriteHeight = cfg.spriteHeight;
    this.spriteData.image = document.getElementById(cfg.imageId) as HTMLImageElement;
    this.spriteData.maxFrame = cfg.maxFrame;

    this.speedX = typeof cfg.speedX === "number" ? cfg.speedX : 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
  }

  override update(deltaTime: number): void {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;
    if (this.y < 0 || this.y > this.game.height - this.height - this.game.groundMargin) {
      this.speedY *= -1;
    }
  }

  override draw(context: CanvasRenderingContext2D): void {
    // Draw the web line
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}
