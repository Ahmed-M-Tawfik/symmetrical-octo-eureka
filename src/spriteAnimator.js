export class SpriteAnimation {
  constructor(game, fps) {
    this.game = game;

    this.fps = fps;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.image = null;

    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.width = 0;
    this.height = 0;

    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 0;
  }
  update(deltaTime) {
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX++;
      if (this.frameX > this.maxFrame) this.frameX = 0;
    }
  }
  draw(context, isDebug = false) {
    if (isDebug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
