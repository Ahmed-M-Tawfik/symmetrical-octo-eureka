import { CollisionSystem } from "../../systems/CollisionSystem.js";
import { DeletionSystem } from "../../systems/DeletionSystem.js";
import { InteractionSystem } from "../../systems/InteractionSystem.js";
import { LifetimeSystem } from "../../systems/LifetimeSystem.js";
import { MovementSystem } from "../../systems/MovementSystem.js";
import { OutOfBoundsSystem } from "../../systems/OutOfBoundsSystem.js";
import { CustomAnimatorSystem } from "../../systems/ParticleAnimatorSystem.js";
import { ParticleRequestSystem } from "../../systems/ParticleRequestSystem.js";
import { PlayerSystem } from "../../systems/PlayerSystem.js";
import type { Level } from "../Level.js";
import { eventBus } from "../engine/EventBus.js";
import { SpriteAnimatorSystem } from "../systems/SpriteAnimatorSystem.js";
import { atIndex } from "../utils/arrayUtils.js";
import { GameState } from "./GameStates.js";

export class PlayingState extends GameState {
  subState: "active" | "paused" = "active";

  override enter(): void {
    this.subState = "active";

    PlayerSystem.resetPlayer(this.game, this.game.session.player);
  }

  override exit(): void {
    // Clear all input actions to prevent stuck keys when leaving playing state
    this.game.input.actions.clear();
  }

  override update(deltaTime: number): void {
    if (this.subState === "paused") return;

    this.game.session.time += deltaTime;

    this.evaluateEndGameCondition();

    this.runUpdates(deltaTime);
  }

  runUpdates(deltaTime: number): void {
    if (this.subState === "paused") {
      return;
    }
    // order for some of these matters
    this._getLevel().update(deltaTime);

    MovementSystem.update(this.game, this.game.session.entities, deltaTime);
    PlayerSystem.update(this.game, this.game.session.player, this.game.input.actions, deltaTime);

    CollisionSystem.update(this.game.session.player, this.game.session.entities);
    InteractionSystem.update(this.game, this.game.session.entities);

    LifetimeSystem.update(this.game.session.entities, deltaTime);
    OutOfBoundsSystem.update(this.game.session.entities);

    ParticleRequestSystem.update(this.game, this.game.session.entities);
    SpriteAnimatorSystem.update(this.game.session.entities, deltaTime);

    CollisionSystem.cleanup(this.game.session.entities);
    DeletionSystem.update(this.game.session.entities);
  }

  evaluateEndGameCondition(): void {
    if (this.game.session.time > this.game.session.maxTime) {
      if (this.game.session.score > this.game.session.winningScore) {
        eventBus.emit("level:won", {
          levelId: this.game.currentGameLevel,
          level: atIndex(this.game.gameLevels, this.game.currentGameLevel),
        });
      } else {
        eventBus.emit("level:lost", {
          levelId: this.game.currentGameLevel,
          level: atIndex(this.game.gameLevels, this.game.currentGameLevel),
        });
      }
    } else if (this.game.session.lives <= 0) {
      eventBus.emit("level:lost", {
        levelId: this.game.currentGameLevel,
        level: atIndex(this.game.gameLevels, this.game.currentGameLevel),
      });
    }
  }

  override draw(context: CanvasRenderingContext2D, deltaTime: number): void {
    // order here matters
    this._getLevel().drawBackground(context);

    SpriteAnimatorSystem.draw(this.game, context, this.game.session.entities, deltaTime, this.game.debug);
    CustomAnimatorSystem.draw(this.game, context, this.game.session.entities, deltaTime);

    this._getLevel().drawForeground(context);

    // UI updates at the end to ensure they are drawn on top
    this.game.UI.draw(context);
  }

  override handleInput(event: KeyboardEvent): void {
    const pauseKeyBinding = this.game.input.keyBindings.actionToKey["pause"];
    if (!pauseKeyBinding) throw new Error("Pause key binding is not defined");

    if (event.key === pauseKeyBinding.key) {
      if (this.subState === "active") {
        this.subState = "paused";
        eventBus.emit("game:paused", {});
      } else if (this.subState === "paused") {
        this.subState = "active";
        eventBus.emit("game:resumed", {});
      }
    }
  }

  _getLevel(): Level {
    const level = this.game.gameLevels[this.game.currentGameLevel];
    if (!level) throw new Error("Current game level is undefined");
    return level;
  }
}
