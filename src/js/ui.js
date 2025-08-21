import { Button } from "./ui/buttons.js";
import { GAME_STATES } from "./gameStates.js";

export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.livesImage = document.getElementById("lives");

    this.game.input.buttons.push(
      new Button(
        "NextLevelBtn",
        this.game.width * 0.5 - 100,
        this.game.height * 0.5 + 100,
        200,
        50,
        () => {
          if (this.game.gameState !== GAME_STATES.LEVEL_COMPLETE) return;
          this.game.nextLevel();
        },
        (context) => {
          if (this.game.gameState !== GAME_STATES.LEVEL_COMPLETE) return;
          context.save();
          context.font = "20px Creepster";
          context.fillStyle = "#845e00ff";
          context.fillRect(this.game.width * 0.5 - 100, this.game.height * 0.5 + 100, 200, 50);
          context.fillStyle = "#001122";
          context.textAlign = "center";
          context.fillText("Next Level", this.game.width * 0.5, this.game.height * 0.5 + 130);
          context.restore();
        }
      )
    );

    this.game.input.buttons.push(
      new Button(
        "RetryLevelBtn",
        this.game.width * 0.5 - 100,
        this.game.height * 0.5 + 100,
        200,
        50,
        () => {
          if (this.game.gameState !== GAME_STATES.GAME_OVER) return;
          this.game.retryLevel();
        },
        (context) => {
          if (this.game.gameState !== GAME_STATES.GAME_OVER) return;
          context.save();
          context.font = "20px Creepster";
          context.fillStyle = "#845e00ff";
          context.fillRect(this.game.width * 0.5 - 100, this.game.height * 0.5 + 100, 200, 50);
          context.fillStyle = "#001122";
          context.textAlign = "center";
          context.fillText("Retry Level", this.game.width * 0.5, this.game.height * 0.5 + 130);
          context.restore();
        }
      )
    );
  }
  draw(context) {
    context.save();

    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;

    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    // score
    context.fillText(`Score: ${this.game.score}`, 20, 50);
    // timer
    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);
    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
    }

    // game state messages
    if (this.game.gameState === GAME_STATES.GAME_OVER) {
      this.drawGameOver(context);
    } else if (this.game.gameState === GAME_STATES.LEVEL_COMPLETE) {
      this.drawLevelComplete(context);
    } else if (this.game.gameState === GAME_STATES.PAUSED) {
      this.drawPaused(context);
    }

    context.restore();

    this.game.input.buttons.forEach((button) => {
      button.draw(context);
    });
  }
  drawGameOver(context) {
    context.save();
    context.textAlign = "center";
    context.font = this.fontSize * 2 + "px " + this.fontFamily;

    context.fillText("Love at first bite?", this.game.width * 0.5, this.game.height * 0.5 - 20);
    context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
    context.fillText("You fought bravely,", this.game.width * 0.5, this.game.height * 0.5 + 20);
    context.fillText("but the night is dark and full of terrors.", this.game.width * 0.5, this.game.height * 0.5 + 50);
    context.restore();
  }
  drawLevelComplete(context) {
    context.save();
    context.textAlign = "center";
    context.font = this.fontSize * 2 + "px " + this.fontFamily;

    context.fillText("Boo-yah", this.game.width * 0.5, this.game.height * 0.5 - 20);
    context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
    context.fillText(
      "What are creatures of the night afraid of? YOU!!!",
      this.game.width * 0.5,
      this.game.height * 0.5 + 20
    );
    context.restore();
  }

  /**
   * Should only be called if the game is NOT over / level NOT complete
   * @param {CanvasRenderingContext2D} context
   */
  drawPaused(context) {
    context.save();

    context.textAlign = "center";
    context.font = this.fontSize * 2 + "px " + this.fontFamily;

    context.fillText("Paused!", this.game.width * 0.5, this.game.height * 0.5 - 20);
    context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
    context.fillText("Press P to resume", this.game.width * 0.5, this.game.height * 0.5 + 20);

    context.restore();
  }
}
