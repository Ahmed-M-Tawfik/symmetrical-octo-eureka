export class InputHandler {
  constructor(game, canvas) {
    this.game = game;
    this.keys = [];
    this.buttons = [];
    this.context = canvas;

    // Make sure the canvas is focused to receive keyboard events
    canvas.focus();

    canvas.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key == "ArrowLeft" ||
          e.key == "ArrowRight" ||
          e.key == "Enter") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      }
      this.processDebugKeys(e);
      this.processGameKeys(e);
    });
    canvas.addEventListener("keyup", (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) {
        this.keys.splice(index, 1);
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
    if (e.key === "d") {
      this.game.debug = !this.game.debug;
    }
    if (e.key === "g") {
      this.game.score += 10;
    }
  }

  processGameKeys(e) {
    if (e.key === "p") {
      this.game.togglePause();
    }
  }
}
