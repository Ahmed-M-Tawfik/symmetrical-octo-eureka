import { GAME_STATES } from "./gameStates.js";

export class InputHandler {
  constructor(game, canvas, keyBindings) {
    this.game = game;
    this.keyBindings = keyBindings;
    this.buttons = [];
    this.actions = new Set();

    // Make sure the canvas is focused to receive keyboard events
    canvas.focus();

    canvas.addEventListener("keydown", (e) => {
      // Only process player actions if game is in PLAYING state
      if (this.game.gameState === GAME_STATES.PLAYING && this.keyBindings.getKeysByGroup("player").includes(e.key)) {
        this.actions.add(this.keyBindings.keyToAction[e.key].action);
      }
      this.processDebugKeys(e);
      this.processGameKeys(e);
    });
    canvas.addEventListener("keyup", (e) => {
      if (this.game.gameState === GAME_STATES.PLAYING && this.keyBindings.getKeysByGroup("player").includes(e.key)) {
        this.actions.delete(this.keyBindings.keyToAction[e.key].action);
      }
    });

    canvas.addEventListener("click", (e) => {
      let mouseX = e.offsetX;
      let mouseY = e.offsetY;
      this.buttons.forEach((button) => {
        if (
          !(
            mouseX < button.x ||
            mouseX > button.x + button.width ||
            mouseY < button.y ||
            mouseY > button.y + button.height
          )
        ) {
          button.onClick();
        }
      });
    });
  }

  processDebugKeys(e) {
    if (e.key === this.keyBindings.actionToKey["debug"].key) {
      this.game.debug = !this.game.debug;
    }
    if (e.key === this.keyBindings.actionToKey["debug_add_score"].key) {
      this.game.score += 10;
    }
  }

  processGameKeys(e) {
    if (e.key === this.keyBindings.actionToKey["pause"].key) {
      this.game.togglePause();
    }
  }
}
