import type { Game } from "../Main.js";

export class GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }
  enter(): void {}
  exit(): void {}
  update(deltaTime: number): void {}
  draw(game: Game, context: CanvasRenderingContext2D, deltaTime: number): void {}
  handleInput(event: KeyboardEvent): void {}
}

export class MainMenuState extends GameState {
  override draw(game: Game, context: CanvasRenderingContext2D, deltaTime: number): void {
    this.game.UI.draw(context);
  }
}

export class GameOverState extends GameState {
  override draw(game: Game, context: CanvasRenderingContext2D, deltaTime: number): void {
    this.game.UI.draw(context);
  }
}

export class LevelCompleteState extends GameState {
  override draw(game: Game, context: CanvasRenderingContext2D, deltaTime: number): void {
    this.game.UI.draw(context);
  }
}
