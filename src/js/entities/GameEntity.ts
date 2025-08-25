import type { GameSession } from "../session/GameSession.js";
import type { Game } from "../Main.js";

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class GameEntity implements IRect {
  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;
  markedForDeletion: boolean;

  constructor(game: Game, x: number, y: number, width: number, height: number) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.markedForDeletion = false;
  }

  start(): void {}
  update(deltaTime: number): void {}
  draw?(context: CanvasRenderingContext2D): void {}
  collidesWith(other: IRect): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }
}
