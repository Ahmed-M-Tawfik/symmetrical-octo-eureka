import { GameEntity } from "./entities/GameEntity.js";

export class Dust extends GameEntity {
  constructor(game, x, y) {
    const size = Math.random() * 10 + 10;
    super(game, x, y, size, size);
    this.size = size;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "rgba(0,0,0,0.2)";
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.97;
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
    const size = Math.random() * 50 + 10;
    super(game, x - size * 0.4, y - size * 0.5, size, size);
    this.image = document.getElementById("fire");
    this.size = size;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 2 + 2;
    this.gravity = 0;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.97;
    if (this.size < 0.5) this.markedForDeletion = true;
    this.gravity += 0.1;
    this.y += this.gravity;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

export class Fire extends GameEntity {
  constructor(game, x, y) {
    const size = Math.random() * 100 + 50;
    super(game, x, y, size, size);
    this.image = document.getElementById("fire");
    this.size = size;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.97;
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
