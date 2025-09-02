import { GAME_CONFIG, PARTICLE_CONFIG } from "../js/data/GameConfig.js";
import { CollisionAnimation } from "../js/entities/CollisionAnimation.js";
import type { CollidableComponent } from "../js/entities/components/CollidableComponent.js";
import type { ParticleRequestComponent } from "../js/entities/components/ParticleRequestComponent.js";
import type { PositionComponent } from "../js/entities/components/PositionComponent.js";
import type { SizeComponent } from "../js/entities/components/SizeComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";
import { Dust, Fire, Splash } from "../js/entities/Particles.js";
import type { Game } from "../js/Main.js";

export class ParticleRequestSystem {
  static update(game: Game, entities: GameEntity[]) {
    // This system should be called after all logic, to process queued effects

    if (
      !PARTICLE_CONFIG["dust"] ||
      !PARTICLE_CONFIG["fire"] ||
      !PARTICLE_CONFIG["splash"] ||
      !GAME_CONFIG["collisionAnimation"]
    ) {
      throw new Error("Particle configuration is missing");
    }

    entities.forEach((entity) => {
      const requests = entity.getComponent<ParticleRequestComponent>("particleRequests")?.requests ?? [];

      requests.forEach((particleRequest) => {
        switch (particleRequest.type) {
          case "dust":
            game.session.entities.push(new Dust(game, particleRequest.x, particleRequest.y, PARTICLE_CONFIG["dust"]!));
            break;
          case "fire":
            game.session.entities.push(new Fire(game, particleRequest.x, particleRequest.y, PARTICLE_CONFIG["fire"]!));
            break;
          case "splash":
            for (let i = 0; i < 30; i++) {
              game.session.entities.push(
                new Splash(game, particleRequest.x, particleRequest.y, PARTICLE_CONFIG["splash"]!)
              );
            }
            break;
        }
      });
      requests.length = 0; // clear after processing

      const pos = entity.getComponent<PositionComponent>("position");
      const size = entity.getComponent<SizeComponent>("size");
      const collisionEvents = entity.getComponent<CollidableComponent>("collidable")?.collisionEvents ?? [];
      if (!pos || !size) return;

      collisionEvents.forEach((event) => {
        if (event.collidedWith === entity) {
          game.session.entities.push(
            new CollisionAnimation(
              game,
              pos.x + size.width * 0.5,
              pos.y + size.height * 0.5,
              GAME_CONFIG["collisionAnimation"]
            )
          );
        }
      });
    });
  }
}
