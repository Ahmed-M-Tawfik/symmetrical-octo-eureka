import { SpriteData } from "./spriteData.js";

class Enemy {
  constructor(game) {
    this.game = game;

    this.spriteData = new SpriteData(game, 20);

    this.markedForDeletion = false;
  }

  update(deltaTime) {
    // movement
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    // bounds check
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }
  draw(context) {
    // noop - we preserve this for any subclasses that use it
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super(game);

    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;

    this.width = this.spriteData.spriteWidth = 60;
    this.height = this.spriteData.spriteHeight = 44;
    this.spriteData.maxFrame = 4;
    this.spriteData.image = document.getElementById("enemy_fly");

    this.speedX = Math.random() + 1;
    this.speedY = 0;

    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);

    this.angle += this.va;
    this.y += Math.sin(this.angle) * 2;
    this.spriteData.y = this.y;
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super(game);

    this.width = this.spriteData.spriteWidth = 60;
    this.height = this.spriteData.spriteHeight = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;

    this.spriteData.image = document.getElementById("enemy_plant");
    this.spriteData.maxFrame = 1;

    this.speedX = 0;
    this.speedY = 0;
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = this.spriteData.spriteWidth = 120;
    this.height = this.spriteData.spriteHeight = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;

    this.spriteData.image = document.getElementById("enemy_spider_big");
    this.spriteData.maxFrame = 5;

    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y < 0 || this.y > this.game.height - this.height - this.game.groundMargin) {
      this.speedY *= -1;
    }
  }
  draw(context) {
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}
