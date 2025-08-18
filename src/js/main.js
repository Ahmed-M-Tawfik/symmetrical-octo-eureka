import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./ui.js";
import { GAME_CONFIG } from "./gameConfig.js";

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

      this.particles = [];
      this.maxParticles = GAME_CONFIG.maxParticles;
      this.collisions = [];
      this.floatingMessages = [];

      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = GAME_CONFIG.enemyInterval;

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

      // enemies
      this.enemyTimer += deltaTime;
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      }

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
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => enemy.draw(context));
      this.particles.forEach((particle) => particle.draw(context));
      this.collisions.forEach((collision) => collision.draw(context));
      this.floatingMessages.forEach((message) => message.draw(context));
      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
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
