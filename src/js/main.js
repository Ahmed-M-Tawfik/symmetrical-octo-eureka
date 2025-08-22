import { GameSession } from "./session/GameSession.js";
import { InputHandler } from "./input.js";
import { UI } from "./ui.js";
import { GAME_CONFIG } from "./data/gameConfig.js";
import { SpriteAnimator } from "./systems/spriteAnimator.js";
import { ParticleAnimator } from "./systems/particleAnimator.js";
import { getLevelSequence } from "./data/levels.js";
import { KeyBindings } from "./ui/keybindings.js";
import { DEFAULT_KEY_BINDINGS } from "./data/keybindingsData.js";
import { PlayingState } from "./states/PlayingState.js";
import { GameOverState } from "./states/GameOverState.js";
import { MainMenuState } from "./states/MainMenuState.js";
import { LevelCompleteState } from "./states/LevelCompleteState.js";

// Origin: https://www.youtube.com/watch?v=GFO_txvwK_c

window.addEventListener("load", function () {
  class Game {
    constructor(width, height, context) {
      this.width = width;
      this.height = height;
      this.speed = 0;
      this.maxSpeed = GAME_CONFIG.backgroundSpeed;

      this.debug = false;

      this.gameLevels = getLevelSequence(this);
      this.currentGameLevel = 0;
      this.gameLevels[this.currentGameLevel].start();

      this.session = new GameSession(this);
      this.spriteAnimator = new SpriteAnimator();
      this.particleAnimator = new ParticleAnimator(this);
      this.input = new InputHandler(this, context.canvas, new KeyBindings(DEFAULT_KEY_BINDINGS));
      this.UI = new UI(this);

      // State machine setup
      this.states = {
        playing: new PlayingState(this),
        gameOver: new GameOverState(this),
        mainMenu: new MainMenuState(this),
        levelComplete: new LevelCompleteState(this),
      };
      // change state only using changeState(state) method
      this.state = this.states.playing;
      this.state.enter();
    }
    update(deltaTime) {
      this.state.update(deltaTime);
    }
    draw(context) {
      this.state.draw(context);
    }
    changeState(newState) {
      this.state.exit();
      this.state = newState;
      this.state.enter();
    }

    _resetLevelState() {
      this.session.reset();
      this.gameLevels[this.currentGameLevel].start();
    }

    nextLevel() {
      this.currentGameLevel = (this.currentGameLevel + 1) % this.gameLevels.length;
      this._resetLevelState();
      this.changeState(this.states.playing);
    }

    retryLevel() {
      this._resetLevelState();
      this.changeState(this.states.playing);
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
