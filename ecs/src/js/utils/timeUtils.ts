// Utility for time scaling with deltaTime and game speed
import type { Game } from "../Main.js";

/**
 * Scales deltaTime by 1/1000 and game speed scale for frame-rate independent movement.
 * @param deltaTime Time since last frame in ms
 * @param game The game instance (must have gameSpeedScale)
 * @returns Scaled time factor
 */
export function scaledDeltaTime(game: Game, deltaTime: number): number {
  return (deltaTime / 1000) * game.gameSpeedScale;
}

export function scaledDecayFactor(baseDecay: number, deltaTime: number, game: Game): number {
  return Math.pow(baseDecay, deltaTime / (1000 / game.gameSpeedScale));
}
