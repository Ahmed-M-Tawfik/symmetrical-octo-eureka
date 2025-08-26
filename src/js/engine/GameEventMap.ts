import type { Enemy } from "../entities/Enemy.js";
import type { GameEntity } from "../entities/GameEntity.js";
import type { Player } from "../entities/Player.js";
import type { Level } from "../Level.js";

// Game EVENTS, not COMMANDS
// We use events here to communicate "this happened" and not "do this"
// This is not a command bus, as the nature of a command bus is to encapsulate a request for action
export type GameEventMap = {
  // Player events
  "player:death": { hitGameEntity: GameEntity };
  "player:hit": { remainingLives: number; hitGameEntity: GameEntity };
  "player:run": { x: number; y: number; speed: number }; // on ground
  "player:sit": { x: number; y: number };
  "player:jump": { x: number; y: number; vy: number };
  "player:fall": { x: number; y: number; vy: number };
  "player:land": { x: number; y: number };
  "player:roll": { x: number; y: number; vy: number };
  "player:dive": { x: number; y: number; vy: number };
  "player:diveEnd": { x: number; y: number };
  "player:stateChange": { from: string; to: string; speed: number };
  "player:reset": {};
  // "player:update": { x: number; y: number; vy: number; remainingLives: number; speed: number };

  // Enemy events
  "enemy:spawned": { enemies: Enemy[] };
  "enemy:collisionWithPlayer": { enemies: Enemy[]; player: Player };
  "enemy:defeatedByPlayer": { enemies: Enemy[]; player: Player };
  "enemy:damagedPlayer": { enemies: Enemy[]; player: Player };

  // Level events
  "level:start": { levelId: number; level: Level }; // any level start

  "level:complete": { levelId: number; level: Level }; // load win screen
  "level:next": { levelId: number; level: Level }; // load next level

  "level:fail": { levelId: number; level: Level }; // load lose screen
  "level:retry": { levelId: number; level: Level }; // reload level

  // Game state events
  "game:update": { deltaTime: number; active_actions: string[] }; // input actions
  // "game:over": { reason: string };
  "game:start": {};
  "game:pause": {};
  "game:resume": {};
  // "game:reset": {};
  // "game:stateChange": { from: string; to: string };

  // Score events
  // "score:change": { amount: number; total: number };
  // "score:milestone": { total: number; milestone: number };

  // UI events
  "ui:buttonClick": { button: string; clickEvent: MouseEvent };
  // "ui:floatingMessage": { value: string; x: number; y: number };

  // Asset events
  // "asset:loaded": { assetId: string };
  // "asset:error": { assetId: string; error: string };

  // Particle events
  // "particle:spawn": { type: string; x: number; y: number };

  // Collision events - not enemies
  "collision:detected": { x: number; y: number; entity: GameEntity };

  // Input events
  // "input:actionStart": { action: string };
  // "input:actionEnd": { action: string };
  // to get list of active actions, subscribe to "game:update"

  // Test/automation events
  "test:debug_active": { active: boolean };
  "test:debug_add_score": {};
  "test:debug_next_level": {};
  "test:debug_retry_level": {};
};
