import { SpriteData } from "../SpriteData.js";
import { GameEntity } from "./GameEntity.js";
import { GAME_CONFIG } from "../data/GameConfig.js";

export class CollisionAnimation extends GameEntity {
  constructor(game, x, y) {
    // Use config values
    const config = GAME_CONFIG.collisionAnimation;
    const spriteWidth = config.spriteWidth;
    const spriteHeight = config.spriteHeight;
    const sizeModifier = Math.random() * (config.sizeModifierMax - config.sizeModifierMin) + config.sizeModifierMin;
    const width = spriteWidth * sizeModifier;
    const height = spriteHeight * sizeModifier;
    // Center the animation on (x, y)
    super(game, x - width * 0.5, y - height * 0.5, width, height);

    const frameInterval = Math.random() * (config.frameIntervalMax - config.frameIntervalMin) + config.frameIntervalMin;
    this.spriteData = new SpriteData(game, frameInterval);
    this.spriteData.spriteWidth = spriteWidth;
    this.spriteData.spriteHeight = spriteHeight;
    this.spriteData.image = document.getElementById(config.imageId);
    this.spriteData.maxFrame = config.maxFrame;
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
