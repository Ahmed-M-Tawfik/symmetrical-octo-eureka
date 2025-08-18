import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { UI } from "./ui.js";
import { GAME_CONFIG } from "./gameConfig.js";
import { SpriteAnimator } from "./systems/spriteAnimator.js";
import { Manual1EnemySpawnStrategy, RandomEnemySpawnStrategy } from "./systems/enemySpawner.js";
import { manual1EnemySpawn } from "./data/enemySpawn/manual1EnemySpawn.js";

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
      // this.enemySpawnStrategy = new RandomEnemySpawnStrategy(this, GAME_CONFIG.enemyInterval);
      this.enemySpawnStrategy = new Manual1EnemySpawnStrategy(this, manual1EnemySpawn);

      this.particles = [];
      this.maxParticles = GAME_CONFIG.maxParticles;
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

      // particles
      this.particles.forEach((particle) => particle.update());

      // collisions
      this.collisions.forEach((collision) => collision.update(deltaTime));

      // deletions
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
      if (this.particles.length > this.maxParticles) {
        this.particles = this.particles.slice(0, this.maxParticles);
      }
      this.collisions = this.collisions.filter((collision) => !collision.markedForDeletion);
      this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);

      this.spriteAnimator.update(deltaTime, this.player);
      this.enemies.forEach((enemy) => this.spriteAnimator.update(deltaTime, enemy));
    }
    draw(context) {
      this.background.draw(context);
      this.spriteAnimator.draw(context, this.player, this.debug);
      this.enemies.forEach((enemy) => this.spriteAnimator.draw(context, enemy, this.debug));
      this.particles.forEach((particle) => particle.draw(context));
      this.collisions.forEach((collision) => collision.draw(context));
      this.floatingMessages.forEach((message) => message.draw(context));
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
