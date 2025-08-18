import { states, Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";
import { SpriteAnimation } from "../spriteAnimator.js";

export class Player {
  constructor(game) {
    this.game = game;

    this.spriteAnimation = new SpriteAnimation(game, 20);

    this.width = this.spriteAnimation.width = 100;
    this.height = this.spriteAnimation.height = 91.3;
    this.x = this.spriteAnimation.x = 0;
    this.y = this.spriteAnimation.y = this.game.height - this.height - this.game.groundMargin;

    this.vy = 0;
    this.weight = 1;

    this.spriteAnimation.spriteWidth = 575;
    this.spriteAnimation.spriteHeight = 525;
    this.spriteAnimation.image = document.getElementById("player");
    this.spriteAnimation.frameX = 0;
    this.spriteAnimation.frameY = 0;
    this.spriteAnimation.maxFrame = 5;

    this.speed = 0;
    this.maxSpeed = 10;

    this.states = [
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
      new Rolling(this),
      new Diving(this),
      new Hit(this),
    ];
    this.currentState = null;
  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);

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

    this.spriteAnimation.y = this.y;
    this.spriteAnimation.x = this.x;
    this.spriteAnimation.update(deltaTime);
  }
  draw(context) {
    this.spriteAnimation.draw(context, this.game.debug);
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        this.x < enemy.x + enemy.width &&
        this.x + this.width > enemy.x &&
        this.y < enemy.y + enemy.height &&
        this.y + this.height > enemy.y
      ) {
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
