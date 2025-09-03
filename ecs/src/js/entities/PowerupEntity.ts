import type { Game } from "../Main.js";
import { GameEntity } from "./GameEntity.js";
import { PowerupComponent, type PowerupType } from "./components/PowerupComponent.js";
import { DeleteIfOutOfBoundsComponent } from "./components/DeleteIfOutOfBoundsComponent.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { SpriteComponent } from "./components/SpriteComponent.js";
import { CollidableComponent } from "./components/CollidableComponent.js";
import { CustomDrawComponent } from "./components/CustomDrawComponent.js";
import { SpeedComponent } from "./components/SpeedComponent.js";
import { AssetManager } from "../systems/AssetManager.js";
import { SizeComponent } from "./components/SizeComponent.js";

export class PowerupEntity extends GameEntity {
  constructor(game: Game, type: PowerupType, value: number = 1, x?: number, y?: number) {
    super(game);
    this.addComponent("powerup", new PowerupComponent(type, value));
    const size = 25;
    this.addComponent("size", new SizeComponent(size, size));

    const horizontalMargin = 400;
    x = x !== undefined ? x : horizontalMargin + Math.random() * (game.width - horizontalMargin); // 400 left margin
    y = y !== undefined ? y : -1 * size; // start above canvas
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("speed", new SpeedComponent(0, 0, 0, 0.1));
    this.addComponent("collidable", new CollidableComponent());
    this.addComponent("deleteIfOutOfBounds", new DeleteIfOutOfBoundsComponent(0, undefined, undefined, undefined));

    // Use correct image and size for each powerup
    let imageId: string;
    let spriteWidth = 50;
    let spriteHeight = 50;
    if (type === "life") {
      imageId = "lives";
    } else {
      imageId = "leaf";
      spriteWidth = 201;
      spriteHeight = 207;
    }
    console.log(imageId);
    const image = AssetManager.getImage(imageId);
    this.addComponent("sprite", new SpriteComponent(0, 0, 0, 0, spriteWidth, spriteHeight, image));

    // Add custom draw with glow effect
    this.addComponent(
      "customDraw",
      new CustomDrawComponent((game, context, entity, deltaTime) => {
        const sprite = entity.getComponent<SpriteComponent>("sprite");
        const size = entity.getComponent<SizeComponent>("size");
        const pos = entity.getComponent<PositionComponent>("position");
        if (!sprite || !pos || !size) return;

        // Glow effect
        context.save();
        context.shadowColor = type === "life" ? "#00ffea" : "#aaff00";
        context.shadowBlur = 20;
        context.globalAlpha = 0.95;
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
        context.restore();
      })
    );
  }
}
