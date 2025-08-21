import { GameState } from "./GameState.js";

export class PausedState extends GameState {
  enter() {}
  exit() {}
  update(deltaTime) {
    // No game updates while paused
  }
  draw(context) {
    // Draw the paused overlay/UI
    this.game.UI.draw(context);
  }
  handleInput(event) {
    const pauseKey = this.game.input.keyBindings.actionToKey["pause"].key;
    if (event.key === pauseKey) {
      this.game.togglePause();
    }
  }
}
