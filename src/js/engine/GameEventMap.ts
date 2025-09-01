import type { PlayerState } from "../entities/components/PlayerComponent.js";
import type { Enemy } from "../entities/Enemy.js";
import type { GameEntity } from "../entities/GameEntity.js";
import type { Player } from "../entities/Player.js";
import type { Level } from "../Level.js";

// Game EVENTS, not COMMANDS
// We use events here to communicate "this happened" and not "do this"
// This is not a command bus, as the nature of a command bus is to encapsulate a request for action
export type GameEventMap = {
  // Player events
  // "player:died": { hitGameEntity: GameEntity };
  // "player:gotHit": { remainingLives: number; hitGameEntity: GameEntity };
  // "player:startedToRun": { x: number; y: number; speed: number }; // on ground
  // "player:stoppedRunning": { x: number; y: number; speed: number; newState: PlayerState }; // on ground
  // "player:startedToSit": { x: number; y: number };
  // "player:stoppedSitting": { x: number; y: number };
  // "player:startedToJump": { x: number; y: number; vy: number };
  // "player:startedToFall": { x: number; y: number; vy: number };
  // "player:landed": { x: number; y: number };
  // "player:startedToRoll": { x: number; y: number; vy: number };
  // "player:startedToDive": { x: number; y: number; vy: number };
  // "player:endedDive": { x: number; y: number };
  "player:stateChanged": { from: PlayerState; to: PlayerState; player: Player };

  // Enemy events
  "enemy:spawned": { enemies: Enemy[] };
  "enemy:collidedWithPlayer": { enemies: Enemy[]; player: Player };
  "enemy:defeatedByPlayer": { enemies: Enemy[]; player: Player };
  "enemy:damagedPlayer": { enemies: Enemy[]; player: Player };

  // Level events
  "level:started": { levelId: number; level: Level }; // any level start

  "level:won": { levelId: number; level: Level }; // load win screen
  "level:startedNext": { levelId: number; level: Level }; // load next level

  "level:lost": { levelId: number; level: Level }; // load lose screen
  "level:startedRetry": { levelId: number; level: Level }; // reload level

  // Game state events
  "game:updateTriggered": { deltaTime: number; active_actions: string[] }; // input actions
  // "game:over": { reason: string };
  "game:started": {};
  "game:paused": {};
  "game:resumed": {};
  // "game:reset": {};
  // "game:stateChange": { from: string; to: string };

  // Score events
  // "score:change": { amount: number; total: number };
  // "score:milestone": { total: number; milestone: number };

  // Game Entity events
  "gameEntity:collidedWithPlayer": { x: number; y: number; entity: GameEntity };

  // Input events
  // "input:actionStart": { action: string };
  // "input:actionEnd": { action: string };
  // to get list of active actions, subscribe to "game:updateTriggered"

  // Test/automation events
  "test:debug_active": { active: boolean };
  "test:debug_add_score": {};
  "test:debug_next_level": {};
  "test:debug_retry_level": {};
};
