import { GameEntity } from "./GameEntity.js";
import { PARTICLE_CONFIG } from "../data/GameConfig.js";

export class Dust extends GameEntity {
  constructor(game, x, y) {
    const cfg = PARTICLE_CONFIG.dust;
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    super(game, x, y, size, size);
    this.size = size;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = cfg.color;
    this.shrink = cfg.shrink;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= this.shrink;
    if (this.size < 0.5) this.markedForDeletion = true;
  }
  draw(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
}

export class Splash extends GameEntity {
  constructor(game, x, y) {
    const cfg = PARTICLE_CONFIG.splash;
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    super(game, x - size * 0.4, y - size * 0.5, size, size);
    this.image = document.getElementById("fire");
    this.size = size;
    this.speedX = Math.random() * (cfg.speedX.max - cfg.speedX.min) + cfg.speedX.min;
    this.speedY = Math.random() * (cfg.speedY.max - cfg.speedY.min) + cfg.speedY.min;
    this.decelRate = 0;
    this.shrink = cfg.shrink;
    this.gravity = cfg.gravity;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= this.shrink;
    if (this.size < 0.5) this.markedForDeletion = true;
    this.decelRate += this.gravity;
    this.y += this.decelRate;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

export class Fire extends GameEntity {
  constructor(game, x, y) {
    const cfg = PARTICLE_CONFIG.fire;
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    super(game, x, y, size, size);
    this.image = document.getElementById("fire");
    this.size = size;
    this.speedX = cfg.speedX;
    this.speedY = cfg.speedY;
    this.angle = 0;
    this.shrink = cfg.shrink;
    this.va = Math.random() * (cfg.va.max - cfg.va.min) + cfg.va.min;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= this.shrink;
    if (this.size < 0.5) this.markedForDeletion = true;
    this.angle += this.va;
    this.x += Math.sin(this.angle * 10);
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    context.restore();
  }
}
