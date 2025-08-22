import { GameState } from "./GameStates.js";

export class PlayingState extends GameState {
  enter() {
    this.subState = "active"; // 'active' or 'paused'
    this.game.session.player.currentState = this.game.session.player.states[0];
    this.game.session.player.currentState.enter();
  }
  exit() {
    // Clear all input actions to prevent stuck keys when leaving playing state
    this.game.input.actions.clear();
  }
  update(deltaTime) {
    if (this.subState === "paused") return;

    this.game.session.time += deltaTime;

    this.evaluateEndGameCondition();

    this.runUpdates(deltaTime);
    this.runDeletions(deltaTime);
  }

  runDeletions(deltaTime) {
    this.game.session.enemies = this.game.session.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.game.session.collisions = this.game.session.collisions.filter((collision) => !collision.markedForDeletion);
    this.game.session.floatingMessages = this.game.session.floatingMessages.filter(
      (message) => !message.markedForDeletion
    );
    this.game.spriteAnimator.update(deltaTime, this.game.session.player);
    this.game.session.enemies.forEach((enemy) => this.game.spriteAnimator.update(deltaTime, enemy));
  }

  runUpdates(deltaTime) {
    this.game.session.player.update(this.game.input.actions, deltaTime);
    this.game.gameLevels[this.game.currentGameLevel].update();
    this.game.gameLevels[this.game.currentGameLevel].spawnStrategy.update(deltaTime);

    this.game.session.enemies.forEach((enemy) => enemy.update(deltaTime));
    this.game.session.floatingMessages.forEach((message) => message.update());
    this.game.particleAnimator.update(deltaTime);
    this.game.session.collisions.forEach((collision) => collision.update(deltaTime));
  }

  evaluateEndGameCondition() {
    if (this.game.session.time > this.game.session.maxTime) {
      if (this.game.session.score > this.game.session.winningScore) {
        this.game.changeState(this.game.states.levelComplete);
      } else {
        this.game.changeState(this.game.states.gameOver);
      }
    }
  }

  draw(context) {
    this.game.gameLevels[this.game.currentGameLevel].draw(context);

    this.game.spriteAnimator.draw(context, this.game.session.player, this.game.debug);
    this.game.session.enemies.forEach((enemy) => this.game.spriteAnimator.draw(context, enemy, this.game.debug));
    this.game.particleAnimator.draw(context);
    this.game.session.collisions.forEach((collision) => collision.draw(context));
    this.game.session.floatingMessages.forEach((message) => message.draw(context));

    // UI updates at the end to ensure they are drawn on top
    this.game.UI.draw(context);
  }

  // game-level input handling
  handleInput(event) {
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
