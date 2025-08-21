import { states, Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";
import { SpriteData } from "./spriteData.js";
import { GameEntity } from "./entities/GameEntity.js";

export class Player extends GameEntity {
  constructor(game) {
    const height = 91.3;
    const width = 100;
    super(game, 0, game.height - height - game.groundMargin, width, height);

    this.spriteData = new SpriteData(game, 20);
    this.spriteData.spriteWidth = 575;
    this.spriteData.spriteHeight = 525;
    this.spriteData.image = document.getElementById("player");
    this.spriteData.frameX = 0;
    this.spriteData.frameY = 0;
    this.spriteData.maxFrame = 5;

    this.states = [
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
      new Rolling(this),
      new Diving(this),
      new Hit(this),
    ];

    this.reset();
  }
  update(actions, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(actions);

    // horizontal movement
    this.x += this.speed;

    // horizontal bounds
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

    // vertical movement
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0;
    }

    // vertical bounds
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.y = this.game.height - this.height - this.game.groundMargin;
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState = this.states[state];
    this.currentState.enter();
  }
  reset() {
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = 1;
    this.speed = 0;
    this.maxSpeed = 10;
    this.setState(this.states[0].state, 0);
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (this.collidesWith(enemy)) {
        // collision detected
        enemy.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(this.game, this.x + this.width * 0.5, this.y + this.height * 0.5)
        );
        if (this.currentState instanceof Diving || this.currentState instanceof Rolling) {
          this.game.score++;
          this.game.floatingMessages.push(new FloatingMessage("+1", enemy.x, enemy.y, 100, 50));
        } else {
          this.setState(states.HIT, 0);
          this.game.lives--;
          if (this.game.lives <= 0) {
            this.game.gameOver = true;
          }
        }
      }
    });
  }
}
