import { GameState } from "./GameStates.js";

export class PlayingState extends GameState {
  subState: "active" | "paused" = "active";

  enter(): void {
    this.subState = "active";
    this.game.session.player.currentState = this.game.session.player.states[0];
    this.game.session.player.currentState.enter();
  }

  exit(): void {
    // Clear all input actions to prevent stuck keys when leaving playing state
    this.game.input.actions.clear();
  }

  update(deltaTime: number): void {
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
    this.game.gameLevels[this.game.currentGameLevel].update(deltaTime);
    this.game.gameLevels[this.game.currentGameLevel].spawnStrategy.update(deltaTime);
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
        this.game.changeState(this.game.states.levelComplete);
      } else {
        this.game.changeState(this.game.states.gameOver);
      }
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    this.game.gameLevels[this.game.currentGameLevel].draw(context);
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

  handleInput(event: KeyboardEvent): void {
    const pauseKey = this.game.input.keyBindings.actionToKey["pause"].key;
    if (event.key === pauseKey) {
      if (this.subState === "active") {
        this.subState = "paused";
      } else if (this.subState === "paused") {
        this.subState = "active";
      }
    }
  }
}
