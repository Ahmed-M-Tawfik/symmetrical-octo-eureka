import { SpriteAnimation } from "../spriteAnimator.js";

class Enemy {
  constructor(game) {
    this.game = game;

    this.spriteAnimation = new SpriteAnimation(game, 20, null, 0, 0, 0, 0, 0, 0, 0);

    this.markedForDeletion = false;
  }

  update(deltaTime) {
    // movement
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    this.spriteAnimation.x = this.x;
    this.spriteAnimation.y = this.y;

    // sprite animation
    this.spriteAnimation.update(deltaTime);

    // bounds check
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw(context) {
    this.spriteAnimation.draw(context, this.game.debug);
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super(game);

    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.spriteAnimation.x = this.x;
    this.spriteAnimation.y = this.y;

    this.width = this.spriteAnimation.width = this.spriteAnimation.spriteWidth = 60;
    this.height = this.spriteAnimation.height = this.spriteAnimation.spriteHeight = 44;
    this.spriteAnimation.maxFrame = 4;

    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.spriteAnimation.image = document.getElementById("enemy_fly");

    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);

    this.angle += this.va;
    this.y += Math.sin(this.angle) * 2;
    this.spriteAnimation.y = this.y;
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super(game);

    this.width = this.spriteAnimation.width = this.spriteAnimation.spriteWidth = 60;
    this.height = this.spriteAnimation.height = this.spriteAnimation.spriteHeight = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.spriteAnimation.height - this.game.groundMargin;
    this.spriteAnimation.x = this.x;
    this.spriteAnimation.y = this.y;

    this.spriteAnimation.image = document.getElementById("enemy_plant");
    this.spriteAnimation.maxFrame = 1;

    this.speedX = 0;
    this.speedY = 0;
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = this.spriteAnimation.width = this.spriteAnimation.spriteWidth = 120;
    this.height = this.spriteAnimation.height = this.spriteAnimation.spriteHeight = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.spriteAnimation.x = this.x;
    this.spriteAnimation.y = this.y;

    this.spriteAnimation.image = document.getElementById("enemy_spider_big");
    this.spriteAnimation.maxFrame = 5;

    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y < 0 || this.y > this.game.height - this.spriteAnimation.height - this.game.groundMargin) {
      this.speedY *= -1;
    }
  }
  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.spriteAnimation.width / 2, 0);
    context.lineTo(this.x + this.spriteAnimation.width / 2, this.y + 50);
    context.stroke();
  }
}
