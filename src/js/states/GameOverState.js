import { GameState } from "./GameState.js";

export class GameOverState extends GameState {
  enter() {
    // Optionally trigger game over UI or sound
  }
  exit() {}
  update(deltaTime) {
    // No updates, just wait for user input to restart or go to menu
  }
  draw(context) {
    this.game.UI.draw(context);
    // Optionally draw game over overlay
  }
  handleInput(event) {
    // Handle restart or menu navigation
  }
}
