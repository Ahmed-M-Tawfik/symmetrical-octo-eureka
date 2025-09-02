import { GAME_CONFIG } from "../js/data/GameConfig.js";
import { ParticleRequest, type ParticleRequestComponent } from "../js/entities/components/ParticleRequestComponent.js";
import type { PlayerComponent } from "../js/entities/components/PlayerComponent.js";
import { PlayerState, initialState, states } from "../js/entities/components/PlayerComponent.js";
import type { PlayerStateChangeRequestComponent } from "../js/entities/components/PlayerStateChangeRequestComponent.js";
import type { PositionComponent } from "../js/entities/components/PositionComponent.js";
import type { SizeComponent } from "../js/entities/components/SizeComponent.js";
import { SpeedComponent } from "../js/entities/components/SpeedComponent.js";
import { SpriteComponent } from "../js/entities/components/SpriteComponent.js";
import type { GameEntity } from "../js/entities/GameEntity.js";
import type { Game } from "../js/Main.js";

export const playerActions = {
  moveLeft: "moveLeft",
  moveRight: "moveRight",
  jump: "jump",
  down: "down",
  roll: "roll",
};

export class PlayerSystem {
  static update(game: Game, entity: GameEntity, actions: Set<string>, deltaTime: number) {
    this.handlePhysicsUpdates(game, entity);

    this.handleStateTransitions(game, entity, actions);
  }

  private static handlePhysicsUpdates(game: Game, entity: GameEntity) {
    const speed = entity.getComponent<SpeedComponent>("speed");
    const pos = entity.getComponent<PositionComponent>("position");
    const size = entity.getComponent<SizeComponent>("size");
    if (!speed || !pos || !size) return;

    // Bounds checks
    if (PlayerSystem.isOnGround(entity)) {
      speed.speedY = 0;
    }
    if (PlayerSystem.isBelowGround(entity)) {
      pos.y = game.height - size.height - game.groundMargin;
    }
    if (PlayerSystem.isOutOfBoundsLeft(entity)) {
      pos.x = 0;
    }
    if (PlayerSystem.isOutOfBoundsRight(entity)) {
      pos.x = game.width - size.width;
    }
  }

  private static handleStateTransitions(game: Game, entity: GameEntity, actions: Set<string>) {
    const player = entity.getComponent<PlayerComponent>("player");
    const pos = entity.getComponent<PositionComponent>("position");
    const size = entity.getComponent<SizeComponent>("size");
    const speed = entity.getComponent<SpeedComponent>("speed");
    const particleRequests = entity.getComponent<ParticleRequestComponent>("particleRequests");
    if (!player || !pos || !size || !speed || !particleRequests) return;

    const request = entity.getComponent<PlayerStateChangeRequestComponent>("stateChangeRequest");
    if (request) {
      PlayerSystem.enterState(game, entity, request.nextState);
      entity.removeComponent("stateChangeRequest");
    }

    if (player.currentState === states.SITTING) {
      if (actions.has(playerActions.moveLeft) || actions.has(playerActions.moveRight)) {
        PlayerSystem.enterState(game, entity, states.RUNNING);
      } else if (actions.has(playerActions.jump)) {
        PlayerSystem.enterState(game, entity, states.JUMPING);
      } else if (actions.has(playerActions.roll)) {
        PlayerSystem.enterState(game, entity, states.ROLLING);
      }
    } else if (player.currentState === states.RUNNING) {
      particleRequests.requests.push(new ParticleRequest("dust", pos.x + size.width * 0.5, pos.y + size.height));
      this.handleHorizontalMovement(entity, actions);
      if (
        actions.has(playerActions.down) &&
        !actions.has(playerActions.moveRight) &&
        !actions.has(playerActions.moveLeft)
      ) {
        PlayerSystem.enterState(game, entity, states.SITTING);
      } else if (actions.has(playerActions.jump)) {
        PlayerSystem.enterState(game, entity, states.JUMPING);
      } else if (actions.has(playerActions.roll)) {
        PlayerSystem.enterState(game, entity, states.ROLLING);
      }
    } else if (player.currentState === states.JUMPING) {
      this.handleHorizontalMovement(entity, actions);
      if (PlayerSystem.isDescending(entity)) {
        PlayerSystem.enterState(game, entity, states.FALLING);
      } else if (actions.has(playerActions.roll)) {
        PlayerSystem.enterState(game, entity, states.ROLLING);
      } else if (actions.has(playerActions.down)) {
        PlayerSystem.enterState(game, entity, states.DIVING);
      }
    } else if (player.currentState === states.FALLING) {
      this.handleHorizontalMovement(entity, actions);
      if (PlayerSystem.isOnGround(entity)) {
        PlayerSystem.enterState(game, entity, states.RUNNING);
      } else if (actions.has(playerActions.roll)) {
        PlayerSystem.enterState(game, entity, states.ROLLING);
      } else if (actions.has(playerActions.down)) {
        PlayerSystem.enterState(game, entity, states.DIVING);
      }
    } else if (player.currentState === states.ROLLING) {
      particleRequests.requests.push(new ParticleRequest("fire", pos.x + size.width * 0.5, pos.y + size.height * 0.5));
      this.handleHorizontalMovement(entity, actions);
      if (!actions.has(playerActions.roll) && PlayerSystem.isOnGround(entity)) {
        PlayerSystem.enterState(game, entity, states.RUNNING);
      } else if (!actions.has(playerActions.roll) && !PlayerSystem.isOnGround(entity)) {
        if (PlayerSystem.isDescending(entity)) {
          PlayerSystem.enterState(game, entity, states.FALLING);
        } else {
          PlayerSystem.enterState(game, entity, states.JUMPING);
        }
      } else if (
        actions.has(playerActions.roll) &&
        actions.has(playerActions.jump) &&
        PlayerSystem.isOnGround(entity)
      ) {
        // launch into air without changing state (rolling overrides jumping state)
        PlayerSystem.startJump(entity);
      } else if (actions.has(playerActions.down) && !PlayerSystem.isOnGround(entity)) {
        PlayerSystem.startDive(entity);
        PlayerSystem.enterState(game, entity, states.DIVING);
      }
    } else if (player.currentState === states.DIVING) {
      particleRequests.requests.push(new ParticleRequest("fire", pos.x + size.width * 0.5, pos.y + size.height * 0.5));
      this.handleHorizontalMovement(entity, actions);
      if (PlayerSystem.isOnGround(entity)) {
        if (actions.has(playerActions.roll)) {
          PlayerSystem.enterState(game, entity, states.ROLLING);
        } else {
          PlayerSystem.enterState(game, entity, states.RUNNING);
        }
        particleRequests.requests.push(new ParticleRequest("splash", pos.x + size.width * 0.5, pos.y + size.height));
      }
    } else if (player.currentState === states.HIT) {
      const sprite = entity.getComponent<SpriteComponent>("sprite");
      if (sprite && sprite.frameX >= 10) {
        if (PlayerSystem.isOnGround(entity)) {
          PlayerSystem.enterState(game, entity, states.RUNNING);
        } else {
          PlayerSystem.enterState(game, entity, states.FALLING);
        }
      }
    }
  }

  private static handleHorizontalMovement(entity: GameEntity, inputActions: Set<string>): void {
    // horizontal movement
    const speed = entity.getComponent<SpeedComponent>("speed");
    if (!speed) return;

    if (inputActions.has(playerActions.moveRight) && inputActions.has(playerActions.moveLeft)) {
      speed.speedX = 0;
    } else if (inputActions.has(playerActions.moveRight)) {
      speed.speedX = speed.maxSpeed;
    } else if (inputActions.has(playerActions.moveLeft)) {
      speed.speedX = -speed.maxSpeed;
    } else {
      speed.speedX = 0;
    }
  }

  private static enterState(game: Game, entity: GameEntity, state: PlayerState) {
    const player = entity.getComponent<PlayerComponent>("player");
    const speed = entity.getComponent<SpeedComponent>("speed");
    if (!player || !speed) return;

    player.currentState = state;

    if (state === states.SITTING) {
      PlayerSystem.setAnimationData(entity, 5, 4);
      PlayerSystem.setGameSpeed(game, 0);
    } else if (state == states.RUNNING) {
      PlayerSystem.setAnimationData(entity, 3, 8);
      PlayerSystem.setGameSpeed(game, 1);
    } else if (state == states.JUMPING) {
      PlayerSystem.setAnimationData(entity, 1, 6);
      if (PlayerSystem.isOnGround(entity)) PlayerSystem.startJump(entity);
      PlayerSystem.setGameSpeed(game, 1);
    } else if (state === states.FALLING) {
      PlayerSystem.setAnimationData(entity, 2, 6);
      PlayerSystem.setGameSpeed(game, 1);
    } else if (state === states.ROLLING) {
      PlayerSystem.setAnimationData(entity, 6, 6);
      PlayerSystem.setGameSpeed(game, 2);
    } else if (state === states.DIVING) {
      PlayerSystem.setAnimationData(entity, 6, 6);
      PlayerSystem.startDive(entity);
      PlayerSystem.setGameSpeed(game, 0);
    } else if (state === states.HIT) {
      PlayerSystem.setAnimationData(entity, 4, 10);
      PlayerSystem.setGameSpeed(game, 0);
    }
  }

  private static startJump(entity: GameEntity): void {
    const speed = entity.getComponent<SpeedComponent>("speed");
    if (!speed) return;

    speed.speedY = -27;
  }

  private static startDive(entity: GameEntity): void {
    const speed = entity.getComponent<SpeedComponent>("speed");
    if (!speed) return;

    speed.speedY = 30;
  }

  private static isDescending(entity: GameEntity): boolean {
    const speed = entity.getComponent<SpeedComponent>("speed");
    if (!speed) return false;

    return speed.speedY > 0;
  }

  private static isOutOfBoundsLeft(entity: GameEntity): boolean {
    const pos = entity.getComponent<PositionComponent>("position");
    if (!pos) return false;

    return pos.x < 0;
  }

  private static isOutOfBoundsRight(entity: GameEntity): boolean {
    const pos = entity.getComponent<PositionComponent>("position");
    const size = entity.getComponent<SizeComponent>("size");
    if (!pos || !size) return false;

    return pos.x + size.width > entity.game.width;
  }

  private static isOnGround(entity: GameEntity): boolean {
    const pos = entity.getComponent<PositionComponent>("position");
    const size = entity.getComponent<SizeComponent>("size");
    if (!pos || !size) return false;

    return pos.y >= entity.game.height - size.height - entity.game.groundMargin;
  }

  private static isBelowGround(entity: GameEntity): boolean {
    const pos = entity.getComponent<PositionComponent>("position");
    const size = entity.getComponent<SizeComponent>("size");
    if (!pos || !size) return false;

    return pos.y > entity.game.height - size.height - entity.game.groundMargin;
  }

  private static setAnimationData(entity: GameEntity, frameY: number, maxFrame: number) {
    const sprite = entity.getComponent<SpriteComponent>("sprite");
    if (sprite) {
      sprite.frameY = frameY;
      sprite.maxFrame = maxFrame;
    }
  }

  private static setGameSpeed(game: Game, speed: number): void {
    game.speed = game.maxSpeed * speed;
  }

  static resetPlayer(game: Game, playerEntity: GameEntity): void {
    const pos = playerEntity.getComponent<PositionComponent>("position");
    const size = playerEntity.getComponent<SizeComponent>("size");
    const player = playerEntity.getComponent<PlayerComponent>("player");
    const speed = playerEntity.getComponent<SpeedComponent>("speed");
    if (!pos || !size || !player || !speed) return;

    pos.x = 0;
    pos.y = game.height - size.height - game.groundMargin;

    speed.speedY = 0;
    speed.weight = GAME_CONFIG.player.weight;
    speed.speedX = 0;
    speed.maxSpeed = GAME_CONFIG.player.maxSpeed;

    PlayerSystem.enterState(game, playerEntity, initialState);
  }
}
