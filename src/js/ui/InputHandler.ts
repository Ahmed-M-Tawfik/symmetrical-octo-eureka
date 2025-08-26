import type { KeyBinding, KeyBindings } from "./KeyBindings.js";
import { Button } from "./Button.js";
import type { Game } from "../Main.js";
import { eventBus } from "../engine/EventBus.js";

export class InputHandler {
  game: Game;
  keyBindings: KeyBindings;
  buttons: Button[];
  actions: Set<string>;

  constructor(game: Game, canvas: HTMLCanvasElement, keyBindings: KeyBindings) {
    this.game = game;
    this.keyBindings = keyBindings;
    this.buttons = [];
    this.actions = new Set<string>();

    // Make sure the canvas is focused to receive keyboard events
    canvas.focus();

    canvas.addEventListener("keydown", (e) => {
      // Only process player actions if game is in PLAYING state
      if (this.game.state === this.game.states.playing && this.keyBindings.getKeysByGroup("player").includes(e.key)) {
        this.actions.add(this.getKeyBinding(this.keyBindings.keyToAction, e.key).action);
      }
      this.processDebugKeys(e);
      // Route game-level input to the current state
      this.game.state.handleInput(e);
    });
    canvas.addEventListener("keyup", (e) => {
      if (this.game.state === this.game.states.playing && this.keyBindings.getKeysByGroup("player").includes(e.key)) {
        this.actions.delete(this.getKeyBinding(this.keyBindings.keyToAction, e.key).action);
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

  processDebugKeys(e: KeyboardEvent) {
    if (e.key === this.getKeyBinding(this.keyBindings.actionToKey, "debug_active").key) {
      eventBus.emit("test:debug_active", { active: !this.game.debug });
    }
    if (e.key === this.getKeyBinding(this.keyBindings.actionToKey, "debug_add_score").key) {
      eventBus.emit("test:debug_add_score", {});
    }
    if (e.key === this.getKeyBinding(this.keyBindings.actionToKey, "debug_next_level").key) {
      eventBus.emit("test:debug_next_level", {});
    }
    if (e.key === this.getKeyBinding(this.keyBindings.actionToKey, "debug_retry_level").key) {
      eventBus.emit("test:debug_retry_level", {});
    }
  }

  getKeyBinding(map: Record<string, KeyBinding>, key: string): NonNullable<KeyBinding> {
    const keyBinding = map[key];
    if (!keyBinding) {
      throw new Error(`Key binding for '${String(key)}' not found`);
    }
    return keyBinding as NonNullable<KeyBinding>;
  }
}
