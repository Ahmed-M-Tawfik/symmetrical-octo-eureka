import { SpriteData } from "../SpriteData.js";
import { GameEntity } from "./GameEntity.js";
import type { Game } from "../Main.js";
import { GAME_CONFIG } from "../data/GameConfig.js";
import type { ISpriteAnimatable } from "../systems/SpriteAnimator.js";
import { AssetManager } from "../systems/AssetManager.js";
import { scaleDeltaTime } from "../utils/timeUtils.js";

export class CollisionAnimation extends GameEntity implements ISpriteAnimatable {
  spriteData: SpriteData;
  sizeModifier: number;
  reachedLastSprite: boolean = false;

  constructor(game: Game, x: number, y: number) {
    // Use config values
    const config = GAME_CONFIG.collisionAnimation;
    const spriteWidth: number = config.spriteWidth;
    const spriteHeight: number = config.spriteHeight;
    const sizeModifier: number =
      Math.random() * (config.sizeModifierMax - config.sizeModifierMin) + config.sizeModifierMin;
    const width: number = spriteWidth * sizeModifier;
    const height: number = spriteHeight * sizeModifier;
    // Center the animation on (x, y)
    super(game, x - width * 0.5, y - height * 0.5, width, height);

    const frameInterval: number =
      Math.random() * (config.frameIntervalMax - config.frameIntervalMin) + config.frameIntervalMin;
    this.spriteData = new SpriteData(game, frameInterval);
    this.spriteData.spriteWidth = spriteWidth;
    this.spriteData.spriteHeight = spriteHeight;
    this.spriteData.image = AssetManager.getImage(config.imageId);
    this.spriteData.maxFrame = config.maxFrame;
    this.spriteData.frameX = 0;

    this.sizeModifier = sizeModifier;
  }

  override update(deltaTime: number): void {
    this.x -= this.game.speed * scaleDeltaTime(deltaTime, this.game);

    if (this.spriteData.frameX === this.spriteData.maxFrame) {
      const calcedNextFrameTimer = this.spriteData.frameTimer + deltaTime;
      if (calcedNextFrameTimer > this.spriteData.frameInterval) {
        this.markedForDeletion = true;
      }
    }
  }
}
