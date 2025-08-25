import type { Game } from "./Main.js";

export class SpriteData {
  game: Game;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  image: HTMLImageElement | null;
  spriteWidth: number;
  spriteHeight: number;
  frameX: number;
  frameY: number;
  maxFrame: number;

  constructor(game: Game, fps: number) {
    this.game = game;
    this.fps = fps;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.image = null;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 0;
  }
}
