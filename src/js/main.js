import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { CityBackground, ForestBackground } from "./background.js";
import { UI } from "./ui.js";
import { GAME_CONFIG } from "./gameConfig.js";
import { SpriteAnimator } from "./systems/spriteAnimator.js";
import { Manual1SpawnStrategy, RandomSpawnStrategy } from "./systems/levelSpawner.js";
import { manual1Spawn } from "./data/spawn/manual1Spawn.js";
import { ParticleAnimator } from "./systems/particleAnimator.js";
import { Level } from "./level.js";
import { KeyBindings } from "./ui/keybindings.js";
import { DEFAULT_KEY_BINDINGS } from "./data/keybindingsData.js";

// https://www.youtube.com/watch?v=GFO_txvwK_c

window.addEventListener("load", function () {
  class Game {
    constructor(width, height, context) {
      this.width = width;
      this.height = height;
      this.speed = 0;
      this.maxSpeed = GAME_CONFIG.playerMaxSpeed;

      this.debug = false;

      this.fontColor = "black";

      this.gameLevels = [
        new Level(this, new CityBackground(this), (game) => {
          return new Manual1SpawnStrategy(this, manual1Spawn);
        }),
        new Level(this, new ForestBackground(this), (game) => {
          return new RandomSpawnStrategy(this, GAME_CONFIG.enemyInterval);
        }),
      ];
      this.currentGameLevel = 0;
      this.gameLevels[this.currentGameLevel].start();

      this.player = new Player(this);
      this.input = new InputHandler(this, context.canvas, new KeyBindings(DEFAULT_KEY_BINDINGS));
      this.UI = new UI(this);
      this.spriteAnimator = new SpriteAnimator();
      this.particleAnimator = new ParticleAnimator(this);

      this.collisions = [];
      this.floatingMessages = [];

      this.enemies = [];

      this.lives = GAME_CONFIG.initialLives;

      this.time = 0; // ms
      this.maxTime = GAME_CONFIG.maxTime;
      this.levelComplete = false;
      this.score = 0;
      this.winningScore = GAME_CONFIG.winningScore;
      this.gameOver = false;

      this.paused = false;

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      if (this.paused || this.gameOver || this.levelComplete) return;

      this.time += deltaTime;
      if (this.time > this.maxTime) {
        if (this.score > this.winningScore) {
          this.levelComplete = true;
        } else {
          this.gameOver = true;
        }
      }

      // updates
      this.player.update(this.input.actions, deltaTime);
      this.gameLevels[this.currentGameLevel].update();

      this.gameLevels[this.currentGameLevel].spawnStrategy.update(deltaTime);

      this.enemies.forEach((enemy) => enemy.update(deltaTime));

      this.floatingMessages.forEach((message) => message.update());

      this.particleAnimator.update(deltaTime);

      this.collisions.forEach((collision) => collision.update(deltaTime));

      // deletions
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

      this.collisions = this.collisions.filter((collision) => !collision.markedForDeletion);
      this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);

      this.spriteAnimator.update(deltaTime, this.player);
      this.enemies.forEach((enemy) => this.spriteAnimator.update(deltaTime, enemy));
    }
    draw(context) {
      this.gameLevels[this.currentGameLevel].draw(context);

      this.spriteAnimator.draw(context, this.player, this.debug);
      this.enemies.forEach((enemy) => this.spriteAnimator.draw(context, enemy, this.debug));

      this.particleAnimator.draw(context);

      this.collisions.forEach((collision) => collision.draw(context));

      this.floatingMessages.forEach((message) => message.draw(context));

      // UI at the end to ensure it's on top
      this.UI.draw(context);
    }
    setLevelComplete() {
      this.levelComplete = true;
    }
    nextLevel() {
      this.currentGameLevel++;
      if (this.currentGameLevel >= this.gameLevels.length) {
        this.currentGameLevel = 0;
      }
      this.enemies = [];

      this.collisions = [];
      this.floatingMessages = [];

      this.score = 0;

      this.time = 0;
      this.levelComplete = false;

      this.gameLevels[this.currentGameLevel].start();
    }
    togglePause() {
      this.paused = !this.paused;
    }
  }

  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = GAME_CONFIG.canvasWidth;
  canvas.height = GAME_CONFIG.canvasHeight;

  const game = new Game(canvas.width, canvas.height, ctx);
  let lastTime = 0;

  function animate(timeStamp) {
    // FPS calc
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.update(deltaTime);

    game.draw(ctx);

    requestAnimationFrame(animate);
  }
  animate(0);
});
