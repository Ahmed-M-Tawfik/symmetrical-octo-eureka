export class GameState {
  constructor(game) {
    this.game = game;
  }
  enter() {}
  exit() {}
  update(deltaTime) {}
  draw(context) {}
  handleInput(event) {}
}

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
