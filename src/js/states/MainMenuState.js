import { GameState } from "./GameStates.js";

export class MainMenuState extends GameState {
  enter() {
    // Setup menu UI if needed
  }
  exit() {}
  update(deltaTime) {
    // No game updates in menu
  }
  draw(context) {
    this.game.UI.draw(context);
    // Optionally draw menu overlay
  }
  handleInput(event) {
    // Handle menu navigation and start game
  }
}
