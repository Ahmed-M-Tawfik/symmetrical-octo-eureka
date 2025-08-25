import { playerActions } from "../states/PlayerStates.js";
import type { IKeyBinding } from "./ConfigTypes";

export const DEFAULT_KEY_BINDINGS: IKeyBinding[] = [
  { action: playerActions.moveLeft, key: "ArrowLeft", group: "player" },
  { action: playerActions.moveRight, key: "ArrowRight", group: "player" },
  { action: playerActions.jump, key: "ArrowUp", group: "player" },
  { action: playerActions.down, key: "ArrowDown", group: "player" },
  { action: playerActions.roll, key: " ", group: "player" },

  { action: "pause", key: "p", group: "game" },

  { action: "debug_active", key: "d", group: "debug" },
  { action: "debug_add_score", key: "g", group: "debug" },
  { action: "debug_next_level", key: "n", group: "debug" },
  { action: "debug_retry_level", key: "r", group: "debug" },
];
