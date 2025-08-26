import { GameSession } from "./session/GameSession.js";
import { atIndex } from "./utils/arrayUtils.js";
import { InputHandler } from "./ui/InputHandler.js";
import { UI } from "./UI.js";
import { GAME_CONFIG } from "./data/GameConfig.js";
import { SpriteAnimator } from "./systems/SpriteAnimator.js";
import { ParticleAnimator } from "./systems/ParticleAnimator.js";
import { getLevelSequence } from "./data/LevelData.js";
import { KeyBindings } from "./ui/KeyBindings.js";
import { DEFAULT_KEY_BINDINGS } from "./data/KeyBindingsData.js";
import { PlayingState } from "./states/PlayingState.js";
import { MainMenuState, GameOverState, LevelCompleteState, GameState } from "./states/GameStates.js";
import { imageAssets } from "./data/ImageAssets.js";
import { AssetManager } from "./systems/AssetManager.js";
import type { Level } from "./Level.js";
import { eventBus } from "./engine/EventBus.js";

// Origin: https://www.youtube.com/watch?v=GFO_txvwK_c

export class Game {
  width: number;
  height: number;
  speed: number;
  maxSpeed: number;
  groundMargin: number;
  debug: boolean;
  gameLevels: Level[];
  currentGameLevel: number;
  session: GameSession;
  spriteAnimator: SpriteAnimator;
  particleAnimator: ParticleAnimator;
  input: InputHandler;
  UI: UI;
  states: {
    playing: PlayingState;
    gameOver: GameOverState;
    mainMenu: MainMenuState;
    levelComplete: LevelCompleteState;
  };
  state: GameState;

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.maxSpeed = GAME_CONFIG.backgroundSpeed;

    this.debug = false;
    eventBus.on("test:debug_active", ({ active }) => {
      this.debug = active;
    });

    eventBus.on("test:debug_next_level", () => {
      this.nextLevel();
    });
    eventBus.on("test:debug_retry_level", () => {
      this.retryLevel();
    });

    this.gameLevels = getLevelSequence(this);
    this.currentGameLevel = 0;
    atIndex(this.gameLevels, this.currentGameLevel).start();
    this.groundMargin = atIndex(this.gameLevels, this.currentGameLevel).background.groundMargin;

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
  update(deltaTime: number) {
    this.state.update(deltaTime);
  }
  draw(context: CanvasRenderingContext2D) {
    this.state.draw(context);
  }
  changeState(newState: GameState) {
    this.state.exit();
    this.state = newState;
    this.state.enter();
  }

  _resetLevelState() {
    this.session.reset();
    atIndex(this.gameLevels, this.currentGameLevel).start();
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

window.addEventListener("load", async function () {
  const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = GAME_CONFIG.canvasWidth;
  canvas.height = GAME_CONFIG.canvasHeight;

  await AssetManager.preloadImages(imageAssets);

  const game = new Game(canvas.width, canvas.height, ctx);
  let lastTime: number = 0;

  function animate(timeStamp: number) {
    // FPS calc
    const deltaTime: number = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(animate);
  }
  animate(0);
});
