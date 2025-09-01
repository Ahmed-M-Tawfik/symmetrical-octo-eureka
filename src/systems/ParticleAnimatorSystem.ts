import type { CustomDrawComponent } from "../js/entities/components/CustomDrawComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";
import type { Game } from "../js/Main.js";

export class CustomAnimatorSystem {
  static draw(game: Game, context: CanvasRenderingContext2D, entities: GameEntity[], deltaTime: number): void {
    entities.forEach((entity) => {
      const customDraw = entity.getComponent<CustomDrawComponent>("customDraw");
      if (!customDraw) return;

      customDraw.draw(game, context, entity, deltaTime);
    });
  }
}
