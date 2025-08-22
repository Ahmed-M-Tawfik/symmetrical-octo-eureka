import { SpriteData } from "../SpriteData.js";
import { GameEntity } from "./GameEntity.js";

export class CollisionAnimation extends GameEntity {
  constructor(game, x, y) {
    // Sprite size and random modifier
    const spriteWidth = 100;
    const spriteHeight = 90;
    const sizeModifier = Math.random() + 0.5;
    const width = spriteWidth * sizeModifier;
    const height = spriteHeight * sizeModifier;
    // Center the animation on (x, y)
    super(game, x - width * 0.5, y - height * 0.5, width, height);

    this.spriteData = new SpriteData(game, Math.random() * 10 + 5);
    this.spriteData.spriteWidth = spriteWidth;
    this.spriteData.spriteHeight = spriteHeight;
    this.spriteData.image = document.getElementById("collisionAnimation");
    this.spriteData.maxFrame = 4;
    this.spriteData.frameX = 0;

    this.sizeModifier = sizeModifier;
  }

  update(deltaTime) {
    this.x -= this.game.speed;

    if (!this.reachedLastSprite && this.spriteData.frameX == this.spriteData.maxFrame) {
      this.reachedLastSprite = true;
    } else if (this.reachedLastSprite) {
      let frameTimerCalc = this.spriteData.frameTimer + deltaTime;
      if (frameTimerCalc > this.spriteData.frameInterval) {
        this.markedForDeletion = true;
      }
    }
  }
}
