import { GameState } from "./GameState.js";

export class LevelCompleteState extends GameState {
  enter() {
    // Show level complete UI or animation
  }
  exit() {}
  update(deltaTime) {
    // Wait for user input or timer to proceed
  }
  draw(context) {
    this.game.UI.draw(context);
    // Optionally draw level complete overlay
  }
  handleInput(event) {
    // Handle next level or menu navigation
  }
}
