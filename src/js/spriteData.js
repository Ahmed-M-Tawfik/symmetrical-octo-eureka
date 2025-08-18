export class SpriteData {
  constructor(game, fps) {
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
