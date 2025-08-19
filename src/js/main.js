import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { UI } from "./ui.js";
import { GAME_CONFIG } from "./gameConfig.js";
import { SpriteAnimator } from "./systems/spriteAnimator.js";
import { RandomSpawnStrategy } from "./systems/levelSpawner.js";
import { ParticleAnimator } from "./systems/particleAnimator.js";

// https://www.youtube.com/watch?v=GFO_txvwK_c

window.addEventListener("load", function () {
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = GAME_CONFIG.groundMargin;
      this.speed = 0;
      this.maxSpeed = GAME_CONFIG.playerMaxSpeed;

      this.debug = false;

      this.fontColor = "black";

      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.spriteAnimator = new SpriteAnimator();
      this.particleAnimator = new ParticleAnimator(this);
      this.enemySpawnStrategy = new RandomSpawnStrategy(this, GAME_CONFIG.enemyInterval);
      // this.enemySpawnStrategy = new Manual1EnemySpawnStrategy(this, manual1EnemySpawn);

      this.collisions = [];
      this.floatingMessages = [];

      this.enemies = [];

      this.lives = GAME_CONFIG.initialLives;

      this.time = 0; // ms
      this.maxTime = GAME_CONFIG.maxTime;
      this.score = 0;
      this.winningScore = GAME_CONFIG.winningScore;
      this.gameOver = false;

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) {
        this.gameOver = true;
      }

      this.player.update(this.input.keys, deltaTime);
      this.background.update();

      this.enemySpawnStrategy.update(deltaTime);

      this.enemies.forEach((enemy) => enemy.update(deltaTime));

      this.floatingMessages.forEach((message) => message.update());

      this.particleAnimator.update(deltaTime);

      // collisions
      this.collisions.forEach((collision) => collision.update(deltaTime));

      // deletions
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

      this.collisions = this.collisions.filter((collision) => !collision.markedForDeletion);
      this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);

      this.spriteAnimator.update(deltaTime, this.player);
      this.enemies.forEach((enemy) => this.spriteAnimator.update(deltaTime, enemy));
    }
    draw(context) {
      this.background.draw(context);

      this.spriteAnimator.draw(context, this.player, this.debug);
      this.enemies.forEach((enemy) => this.spriteAnimator.draw(context, enemy, this.debug));

      this.particleAnimator.draw(context);

      this.collisions.forEach((collision) => collision.draw(context));

      this.floatingMessages.forEach((message) => message.draw(context));

      // UI at the end to ensure it's on top
      this.UI.draw(context);
    }
  }

  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = GAME_CONFIG.canvasWidth;
  canvas.height = GAME_CONFIG.canvasHeight;

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    // FPS calc
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.update(deltaTime);

    game.draw(ctx);

    if (!game.gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
