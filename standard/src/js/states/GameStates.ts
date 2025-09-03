import type { Game } from "../Main.js";

export class GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }
  enter(): void {}
  exit(): void {}
  update(deltaTime: number): void {}
  draw(context: CanvasRenderingContext2D): void {}
  handleInput(event: KeyboardEvent): void {}
}

export class MainMenuState extends GameState {
  override draw(context: CanvasRenderingContext2D): void {
    this.game.UI.draw(context);
  }
}

export class GameOverState extends GameState {
  override draw(context: CanvasRenderingContext2D): void {
    this.game.UI.draw(context);
  }
}

export class LevelCompleteState extends GameState {
  override draw(context: CanvasRenderingContext2D): void {
    this.game.UI.draw(context);
  }
}
