import { GameState } from "./GameStates.js";
import { atIndex, first } from "../utils/arrayUtils.js";
import type { Level } from "../Level.js";
import { eventBus } from "../engine/EventBus.js";

export class PlayingState extends GameState {
  subState: "active" | "paused" = "active";

  override enter(): void {
    this.subState = "active";
    this.game.session.player.currentState = first(this.game.session.player.states);
    this.game.session.player.currentState.enter();
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
    this.runDeletions();
  }

  runDeletions(): void {
    this.game.session.enemies = this.game.session.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.game.session.collisions = this.game.session.collisions.filter((collision) => !collision.markedForDeletion);
    this.game.session.floatingMessages = this.game.session.floatingMessages.filter(
      (message) => !message.markedForDeletion
    );
  }

  runUpdates(deltaTime: number): void {
    this.game.session.player.updateWithActions(this.game.input.actions, deltaTime);
    this.game.spriteAnimator.update(deltaTime, this.game.session.player);

    const level = this._getLevel();
    level.update(deltaTime);
    this.game.session.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      this.game.spriteAnimator.update(deltaTime, enemy);
    });
    this.game.particleAnimator.update(deltaTime);
    this.game.session.collisions.forEach((collision) => {
      collision.update(deltaTime);
      this.game.spriteAnimator.update(deltaTime, collision);
    });
    this.game.session.floatingMessages.forEach((message) => message.update());
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
    }
  }

  override draw(context: CanvasRenderingContext2D): void {
    this._getLevel().draw(context);
    this.game.spriteAnimator.draw(context, this.game.session.player, this.game.debug);
    this.game.session.enemies.forEach((enemy) => this.game.spriteAnimator.draw(context, enemy, this.game.debug));
    this.game.particleAnimator.draw(context);
    this.game.session.collisions.forEach((collision) =>
      this.game.spriteAnimator.draw(context, collision, this.game.debug)
    );
    this.game.session.floatingMessages.forEach((message) => message.draw(context));
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
