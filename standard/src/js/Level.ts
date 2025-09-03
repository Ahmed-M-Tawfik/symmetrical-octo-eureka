import type { Game } from "./Main.js";
import type { Background } from "./ui/Background.js";
import { SpawnStrategy } from "./systems/SpawnStrategy.js";

export class Level {
  game: Game;
  background: Background;
  spawnStrategyCallback: (game: Game) => SpawnStrategy;
  spawnStrategy: SpawnStrategy;

  constructor(game: Game, background: Background, spawnStrategyCallback: (game: Game) => SpawnStrategy) {
    this.game = game;
    this.background = background;
    this.spawnStrategyCallback = spawnStrategyCallback;
    this.spawnStrategy = new SpawnStrategy(game); // Placeholder prior to start() being called
  }

  start(): void {
    this.background.start();
    this.spawnStrategy = this.spawnStrategyCallback(this.game);
    this.spawnStrategy.start();
  }

  update(deltaTime: number): void {
    this.background.update(deltaTime);
    this.spawnStrategy.update(deltaTime);
  }

  draw(context: CanvasRenderingContext2D): void {
    this.background.draw(context);
  }
}
