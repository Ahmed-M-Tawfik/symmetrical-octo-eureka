import type { Game } from "../Main.js";
import { AssetManager } from "../systems/AssetManager.js";
import { GameEntity } from "./GameEntity.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { SizeComponent } from "./components/SizeComponent.js";
import { initialState, PlayerComponent } from "./components/PlayerComponent.js";
import type { IGameConfig } from "../data/ConfigTypes.js";
import { SpriteComponent } from "./components/SpriteComponent.js";
import { ParticleRequestComponent } from "./components/ParticleRequestComponent.js";
import { SpeedComponent } from "./components/SpeedComponent.js";
import { scaledDeltaTime } from "../utils/timeUtils.js";
import { CustomMovementComponent } from "./components/CustomMovementComponent.js";
import { CollidableComponent } from "./components/CollidableComponent.js";

const msInASecond = 1000;

export class Player extends GameEntity {
  // todo: move to system - in canonical ECS, components are purely added to empty entity
  constructor(game: Game, playerConfig: IGameConfig["player"]) {
    super(game);

    const { width, height, spriteWidth, spriteHeight, maxFrame, maxSpeed, weight, spriteFps } = playerConfig;
    this.addComponent("player", new PlayerComponent(initialState));
    this.addComponent("position", new PositionComponent(0, 0));
    this.addComponent("size", new SizeComponent(width, height));
    this.addComponent("speed", new SpeedComponent(0, 0, maxSpeed, weight));
    this.addComponent("customMovement", new CustomMovementComponent(customMovementPlayer, {}));
    this.addComponent(
      "sprite",
      new SpriteComponent(
        0,
        0,
        maxFrame,
        msInASecond / spriteFps,
        spriteWidth,
        spriteHeight,
        AssetManager.getImage("player")
      )
    );
    this.addComponent("particleRequests", new ParticleRequestComponent());
    this.addComponent("collidable", new CollidableComponent());

    // this is done in playersystem, where the rest of constructor should be moved
    // this.reset();
  }
}

function customMovementPlayer(game: Game, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const speed = entity.getComponent<SpeedComponent>("speed");
  if (!pos || !speed) return;

  const scaled = scaledDeltaTime(game, deltaTime);

  speed.speedY += speed.weight * scaled;

  pos.x += speed.speedX * scaled;
  pos.y += speed.speedY * scaled;
}
