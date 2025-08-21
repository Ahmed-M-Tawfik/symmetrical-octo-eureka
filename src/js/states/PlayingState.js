import { GameState } from "./GameState.js";

export class PlayingState extends GameState {
  enter() {}
  exit() {
    // Clear all input actions to prevent stuck keys when leaving playing state
    this.game.input.actions.clear();
  }
  update(deltaTime) {
    this.game.time += deltaTime;

    this.evaluateEndGameCondition();

    // updates
    this.runUpdates(deltaTime);

    // deletions
    this.runDeletions(deltaTime);
  }

  runDeletions(deltaTime) {
    this.game.enemies = this.game.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.game.collisions = this.game.collisions.filter((collision) => !collision.markedForDeletion);
    this.game.floatingMessages = this.game.floatingMessages.filter((message) => !message.markedForDeletion);
    this.game.spriteAnimator.update(deltaTime, this.game.player);
    this.game.enemies.forEach((enemy) => this.game.spriteAnimator.update(deltaTime, enemy));
  }

  runUpdates(deltaTime) {
    this.game.player.update(this.game.input.actions, deltaTime);
    this.game.gameLevels[this.game.currentGameLevel].update();
    this.game.gameLevels[this.game.currentGameLevel].spawnStrategy.update(deltaTime);

    this.game.enemies.forEach((enemy) => enemy.update(deltaTime));
    this.game.floatingMessages.forEach((message) => message.update());
    this.game.particleAnimator.update(deltaTime);
    this.game.collisions.forEach((collision) => collision.update(deltaTime));
  }

  evaluateEndGameCondition() {
    if (this.game.time > this.game.maxTime) {
      if (this.game.score > this.game.winningScore) {
        this.game.changeState(this.game.states.levelComplete);
      } else {
        this.game.changeState(this.game.states.gameOver);
      }
    }
  }

  draw(context) {
    this.game.gameLevels[this.game.currentGameLevel].draw(context);

    // game entities
    this.game.spriteAnimator.draw(context, this.game.player, this.game.debug);
    this.game.enemies.forEach((enemy) => this.game.spriteAnimator.draw(context, enemy, this.game.debug));
    this.game.particleAnimator.draw(context);
    this.game.collisions.forEach((collision) => collision.draw(context));
    this.game.floatingMessages.forEach((message) => message.draw(context));

    // UI updates at the end to ensure they are drawn on top
    this.game.UI.draw(context);
  }

  // game-level input handling
  handleInput(event) {
    const pauseKey = this.game.input.keyBindings.actionToKey["pause"].key;
    if (event.key === pauseKey) {
      this.game.togglePause();
    }
  }
}
