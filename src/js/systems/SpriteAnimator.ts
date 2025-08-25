import type { SpriteData } from "../SpriteData.js";
import type { IRect } from "../entities/GameEntity.js";

export interface ISpriteAnimatable extends IRect {
  spriteData: SpriteData;
  draw?: (context: CanvasRenderingContext2D) => void;
}

export class SpriteAnimator {
  update(deltaTime: number, gameEntity: ISpriteAnimatable): void {
    let s = gameEntity.spriteData;
    s.frameTimer += deltaTime;
    if (s.frameTimer > s.frameInterval) {
      s.frameTimer = 0;
      s.frameX++;
      if (s.frameX > s.maxFrame) s.frameX = 0;
    }
  }

  draw(context: CanvasRenderingContext2D, gameEntity: ISpriteAnimatable, isDebug: boolean = false): void {
    if (isDebug) {
      context.strokeRect(gameEntity.x, gameEntity.y, gameEntity.width, gameEntity.height);
    }
    context.drawImage(
      gameEntity.spriteData.image,
      gameEntity.spriteData.frameX * gameEntity.spriteData.spriteWidth,
      gameEntity.spriteData.frameY * gameEntity.spriteData.spriteHeight,
      gameEntity.spriteData.spriteWidth,
      gameEntity.spriteData.spriteHeight,
      gameEntity.x,
      gameEntity.y,
      gameEntity.width,
      gameEntity.height
    );
    if (gameEntity.draw) gameEntity.draw(context);
  }
}
