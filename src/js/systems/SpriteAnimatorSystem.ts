import type { Game } from "../Main.js";
import type { GameEntity } from "../entities/GameEntity.js";
import type { CustomDrawComponent } from "../entities/components/CustomDrawComponent.js";
import type { PositionComponent } from "../entities/components/PositionComponent.js";
import { SizeComponent } from "../entities/components/SizeComponent.js";
import type { SpriteComponent } from "../entities/components/SpriteComponent.js";

export class SpriteAnimatorSystem {
  // constructor() {
  //   eventBus.on("enemy:collidedWithPlayer", (data) => {
  //     data.enemies.forEach((enemy) => {
  //       const pos = enemy.getComponent<PositionComponent>("position");
  //       const size = enemy.getComponent<SizeComponent>("size");
  //       if (!pos || !size) return;

  //       this.game.session.collisions.push(
  //         new CollisionAnimation(
  //           this.game,
  //           pos.x + size.width * 0.5,
  //           pos.y + size.height * 0.5,
  //           GAME_CONFIG.collisionAnimation
  //         )
  //       );
  //     });
  //   });
  // }

  static update(entities: GameEntity[], deltaTime: number): void {
    entities.forEach((gameEntity) => {
      const sprite = gameEntity.getComponent<SpriteComponent>("sprite");
      if (!sprite) return;

      sprite.frameTimer += deltaTime;
      if (sprite.frameTimer > sprite.frameInterval) {
        sprite.frameTimer = 0;
        sprite.frameX++;
        if (sprite.frameX > sprite.maxFrame) sprite.frameX = 0;
      }
    });
  }

  static draw(
    game: Game,
    context: CanvasRenderingContext2D,
    entities: GameEntity[],
    deltaTime: number,
    isDebug: boolean = false
  ): void {
    entities.forEach((gameEntity) => {
      const sprite = gameEntity.getComponent<SpriteComponent>("sprite");
      const pos = gameEntity.getComponent<PositionComponent>("position");
      const size = gameEntity.getComponent<SizeComponent>("size");
      if (!sprite || !pos || !size) return;

      if (isDebug) {
        context.strokeRect(pos.x, pos.y, size.width, size.height);
      }
      if (!sprite.image) {
        throw new Error("Sprite image not found for " + sprite.image);
      }
      context.drawImage(
        sprite.image,
        sprite.frameX * sprite.spriteWidth,
        sprite.frameY * sprite.spriteHeight,
        sprite.spriteWidth,
        sprite.spriteHeight,
        pos.x,
        pos.y,
        size.width,
        size.height
      );

      const customDraw = gameEntity.getComponent<CustomDrawComponent>("customDraw");
      if (customDraw) {
        customDraw.draw(game, context, gameEntity, deltaTime);
      }
    });
  }
}
