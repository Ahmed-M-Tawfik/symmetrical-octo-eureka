import { SpriteData } from "./spriteData.js";
import { GameEntity } from "./entities/GameEntity.js";
import { ENEMY_CONFIG } from "./data/gameConfig.js";

export class FlyingEnemy extends GameEntity {
  constructor(game, x = undefined, y = undefined, speedX = undefined, va = undefined) {
    const cfg = ENEMY_CONFIG.flying;
    const spawnX = x !== undefined ? x : game.width + Math.random() * game.width * 0.5;
    const spawnY = y !== undefined ? y : Math.random() * game.height * 0.5;
    super(game, spawnX, spawnY, cfg.width, cfg.height);

    this.spriteData = new SpriteData(game, 20);
    this.spriteData.spriteWidth = cfg.spriteWidth;
    this.spriteData.spriteHeight = cfg.spriteHeight;
    this.spriteData.maxFrame = cfg.maxFrame;
    this.spriteData.image = document.getElementById("enemy_fly");

    this.speedX = speedX !== undefined ? speedX : Math.random() * (cfg.speedX.max - cfg.speedX.min) + cfg.speedX.min;
    this.speedY = 0;

    this.angle = 0;
    this.va = va !== undefined ? va : Math.random() * (cfg.va.max - cfg.va.min) + cfg.va.min;
  }
  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;

    this.angle += this.va;
    this.y += Math.sin(this.angle) * 2;
    this.spriteData.y = this.y;
  }
}

export class GroundEnemy extends GameEntity {
  constructor(game) {
    const cfg = ENEMY_CONFIG.ground;
    const x = game.width;
    const y = game.height - cfg.height - game.groundMargin;
    super(game, x, y, cfg.width, cfg.height);

    this.spriteData = new SpriteData(game, 20);
    this.spriteData.spriteWidth = cfg.spriteWidth;
    this.spriteData.spriteHeight = cfg.spriteHeight;
    this.spriteData.image = document.getElementById("enemy_plant");
    this.spriteData.maxFrame = cfg.maxFrame;

    this.speedX = cfg.speedX;
    this.speedY = 0;
  }
  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }
}

export class ClimbingEnemy extends GameEntity {
  constructor(game) {
    const cfg = ENEMY_CONFIG.climbing;
    const x = game.width;
    const y = Math.random() * game.height * 0.5;
    super(game, x, y, cfg.width, cfg.height);

    this.spriteData = new SpriteData(game, 20);
    this.spriteData.spriteWidth = cfg.spriteWidth;
    this.spriteData.spriteHeight = cfg.spriteHeight;
    this.spriteData.image = document.getElementById("enemy_spider_big");
    this.spriteData.maxFrame = cfg.maxFrame;

    this.speedX = cfg.speedX;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
  }
  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;
    if (this.y < 0 || this.y > this.game.height - this.height - this.game.groundMargin) {
      this.speedY *= -1;
    }
  }
  draw(context) {
    // Draw the web line
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}
