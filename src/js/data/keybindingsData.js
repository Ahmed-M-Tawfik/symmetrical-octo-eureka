import { playerActions } from "../playerStates.js";

export const DEFAULT_KEY_BINDINGS = [
  { action: playerActions.moveLeft, key: "ArrowLeft", group: "player" },
  { action: playerActions.moveRight, key: "ArrowRight", group: "player" },
  { action: playerActions.jump, key: "ArrowUp", group: "player" },
  { action: playerActions.down, key: "ArrowDown", group: "player" },
  { action: playerActions.roll, key: " ", group: "player" },

  { action: "pause", key: "p", group: "game" },

  { action: "debug", key: "d", group: "debug" },
  { action: "debug_add_score", key: "g", group: "debug" },
];
