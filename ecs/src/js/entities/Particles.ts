import { GameEntity } from "./GameEntity.js";
import { PositionComponent } from "./components/PositionComponent.js";
import { SizeComponent } from "./components/SizeComponent.js";
import { ColorComponent } from "./components/ColorComponent.js";
import { ShrinkComponent } from "./components/ShrinkComponent.js";
import { SpeedComponent } from "./components/SpeedComponent.js";
import type { IParticleConfig } from "../data/ConfigTypes.js";
import type { Game } from "../Main.js";
import { ImageComponent } from "./components/ImageComponent.js";
import { LifetimeComponent } from "./components/LifetimeComponent.js";
import { AssetManager } from "../systems/AssetManager.js";
import { CustomMovementComponent } from "./components/CustomMovementComponent.js";
import { CustomDrawComponent } from "./components/CustomDrawComponent.js";
import { scaledDecayFactor, scaledDeltaTime } from "../utils/timeUtils.js";
import { ParticleComponent } from "./components/ParticleComponent.js";

// ECS-compliant Dust particle
export class Dust extends GameEntity {
  constructor(game: Game, x: number, y: number, cfg: IParticleConfig) {
    super(game);
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    this.addComponent("particle", new ParticleComponent());
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("size", new SizeComponent(size, size));
    this.addComponent("color", new ColorComponent(cfg.color ?? "black"));
    this.addComponent("shrink", new ShrinkComponent(cfg.shrink));
    this.addComponent("speed", new SpeedComponent(Math.random(), 0, Math.random(), 0));
    this.addComponent("lifetime", new LifetimeComponent(cfg.maxLifetime));

    this.addComponent("customMovement", new CustomMovementComponent(dustUpdate));
    this.addComponent("customDraw", new CustomDrawComponent(dustDraw));
  }
}

function dustUpdate(game: Game, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const speed = entity.getComponent<SpeedComponent>("speed");
  const shrink = entity.getComponent<ShrinkComponent>("shrink");
  const size = entity.getComponent<SizeComponent>("size");
  const customMovement = entity.getComponent<CustomMovementComponent>("customMovement");
  if (!pos || !speed || !shrink || !size || !customMovement) return;

  const movementState = customMovement.customMovementState;

  const scaled = scaledDeltaTime(game, deltaTime);
  pos.x -= (speed.speedX + game.speed) * scaled;
  pos.y -= speed.speedY * scaled;

  // optimize to not do Math.pow 30 times per frame...
  if (movementState["shrinkSpeedUsedDeltaTime"] !== deltaTime) {
    movementState["shrinkSpeed"] = scaledDecayFactor(shrink.shrink, deltaTime, game);
    movementState["shrinkSpeedUsedDeltaTime"] = deltaTime;
  }
  size.width *= movementState["shrinkSpeed"]; // circle - we don't need height
}

function dustDraw(game: Game, context: CanvasRenderingContext2D, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const size = entity.getComponent<SizeComponent>("size");
  const color = entity.getComponent<ColorComponent>("color");
  if (!pos || !size || !color) return;

  context.save();
  context.beginPath();
  context.arc(pos.x, pos.y, size.width, 0, Math.PI * 2);
  context.fillStyle = color.color;
  context.fill();
  context.restore();
}

// ECS-compliant Splash particle
export class Splash extends GameEntity {
  constructor(game: Game, x: number, y: number, cfg: IParticleConfig) {
    super(game);
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    this.addComponent("particle", new ParticleComponent());
    this.addComponent("position", new PositionComponent(x - size * 0.4, y - size * 0.5));
    this.addComponent("size", new SizeComponent(size, size));
    this.addComponent("shrink", new ShrinkComponent(cfg.shrink));
    if (cfg.imageId) {
      this.addComponent("image", new ImageComponent(AssetManager.getImage(cfg.imageId)));
    }
    this.addComponent("lifetime", new LifetimeComponent(cfg.maxLifetime));

    const speedX =
      typeof cfg.speedX === "number"
        ? cfg.speedX
        : cfg.speedX && typeof cfg.speedX.min === "number" && typeof cfg.speedX.max === "number"
        ? Math.random() * (cfg.speedX.max - cfg.speedX.min) + cfg.speedX.min
        : 0;
    const speedY =
      typeof cfg.speedY === "number"
        ? cfg.speedY
        : cfg.speedY && typeof cfg.speedY.min === "number" && typeof cfg.speedY.max === "number"
        ? Math.random() * (cfg.speedY.max - cfg.speedY.min) + cfg.speedY.min
        : 0;
    this.addComponent("speed", new SpeedComponent(speedX, 0, speedY, 1));

    this.addComponent(
      "customMovement",
      new CustomMovementComponent(splashUpdate, {
        decelRate: 0,
        gravity: cfg.gravity ?? 0.1,
      })
    );
    this.addComponent("customDraw", new CustomDrawComponent(splashDraw));
  }
}

function splashUpdate(game: Game, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const speed = entity.getComponent<SpeedComponent>("speed");
  const shrink = entity.getComponent<ShrinkComponent>("shrink");
  const size = entity.getComponent<SizeComponent>("size");
  const customMovement = entity.getComponent<CustomMovementComponent>("customMovement");
  if (!pos || !speed || !shrink || !size || !customMovement) return;

  const movementState = customMovement.customMovementState;

  const scaled = scaledDeltaTime(game, deltaTime);
  pos.x -= (speed.speedX + game.speed) * scaled;
  pos.y -= speed.speedY * scaled;

  // speed.speedY += speed.weight * scaled;
  movementState["decelRate"] += movementState["gravity"] * scaled;
  pos.y += movementState["decelRate"] * scaled;

  // optimize to not do Math.pow 30 times per frame...
  if (movementState["shrinkSpeedUsedDeltaTime"] !== deltaTime) {
    movementState["shrinkSpeed"] = scaledDecayFactor(shrink.shrink, deltaTime, game);
    movementState["shrinkSpeedUsedDeltaTime"] = deltaTime;
  }
  size.width *= movementState["shrinkSpeed"];
  size.height *= movementState["shrinkSpeed"];
}

function splashDraw(game: Game, context: CanvasRenderingContext2D, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const size = entity.getComponent<SizeComponent>("size");
  const image = entity.getComponent<ImageComponent>("image");
  if (!pos || !size || !image) return;

  context.drawImage(image.image, pos.x, pos.y, size.width, size.height);
}

// ECS-compliant Fire particle
export class Fire extends GameEntity {
  constructor(game: Game, x: number, y: number, cfg: IParticleConfig) {
    super(game);
    const size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
    this.addComponent("particle", new ParticleComponent());
    this.addComponent("position", new PositionComponent(x, y));
    this.addComponent("size", new SizeComponent(size, size));
    this.addComponent("shrink", new ShrinkComponent(cfg.shrink));
    if (cfg.imageId) {
      this.addComponent("image", new ImageComponent(AssetManager.getImage(cfg.imageId)));
    }
    this.addComponent("lifetime", new LifetimeComponent(cfg.maxLifetime));
    this.addComponent(
      "speed",
      new SpeedComponent(
        typeof cfg.speedX === "number" ? cfg.speedX : 1,
        0,
        typeof cfg.speedY === "number" ? cfg.speedY : 1,
        0
      )
    );
    this.addComponent(
      "customMovement",
      new CustomMovementComponent(fireUpdate, {
        decelRate: 0,
        gravity: cfg.gravity ?? 0.1,
        angle: 0,
        va: typeof cfg.va === "number" ? cfg.va : Math.random() * (cfg.va!.max - cfg.va!.min) + cfg.va!.min,
      })
    );
    this.addComponent(
      "customDraw",
      new CustomDrawComponent(
        fireDraw,
        this.getComponent<CustomMovementComponent>("customMovement")!.customMovementState
      )
    );
  }
}

function fireUpdate(game: Game, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const speed = entity.getComponent<SpeedComponent>("speed");
  const shrink = entity.getComponent<ShrinkComponent>("shrink");
  const size = entity.getComponent<SizeComponent>("size");
  const customMovement = entity.getComponent<CustomMovementComponent>("customMovement");

  if (!pos || !speed || !shrink || !size || !customMovement) return;

  const movementState = customMovement.customMovementState;

  const scaled = scaledDeltaTime(game, deltaTime);
  pos.x -= (speed.speedX + game.speed) * scaled;
  pos.y -= speed.speedY * scaled;

  // optimize to not do Math.pow 30 times per frame...
  if (movementState["shrinkSpeedUsedDeltaTime"] !== deltaTime) {
    movementState["shrinkSpeed"] = scaledDecayFactor(shrink.shrink, deltaTime, game);
    movementState["shrinkSpeedUsedDeltaTime"] = deltaTime;
  }
  size.width *= movementState["shrinkSpeed"];
  size.height *= movementState["shrinkSpeed"];

  movementState["angle"] += movementState["va"] * scaled;
  pos.x += Math.sin(movementState["angle"] * 10) * scaled;
}

function fireDraw(game: Game, context: CanvasRenderingContext2D, entity: GameEntity, deltaTime: number) {
  const pos = entity.getComponent<PositionComponent>("position");
  const size = entity.getComponent<SizeComponent>("size");
  const image = entity.getComponent<ImageComponent>("image");
  const customDraw = entity.getComponent<CustomDrawComponent>("customDraw");
  if (!pos || !size || !image || !customDraw) return;

  context.save();
  context.translate(pos.x, pos.y);
  context.rotate(customDraw.customDrawState["angle"]);
  context.drawImage(image.image, -size.width * 0.5, -size.height * 0.5, size.width, size.height);
  context.restore();
}
