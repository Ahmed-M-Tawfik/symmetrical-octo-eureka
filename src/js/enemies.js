class Enemy {
  constructor(game) {
    this.game = game;

    this.x = 0;
    this.y = 0;

    this.frameX = 0;

    this.fps = 20; // sprite animation fps, not GAME fps
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.markedForDeletion = false;
  }

  update(deltaTime) {
    // movement
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    // sprite animation
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX++;
      if (this.frameX > this.maxFrame) this.frameX = 0;
    }

    // bounds check
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw(context) {
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 4;
    this.image = document.getElementById("enemy_fly");

    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);

    this.angle += this.va;
    this.y += Math.sin(this.angle) * 2;
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById("enemy_plant");
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 1;
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.image = document.getElementById("enemy_spider_big");
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y < 0 || this.y > this.game.height - this.height - this.game.groundMargin) {
      this.speedY *= -1;
    }
  }
  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}
