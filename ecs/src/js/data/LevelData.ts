import { Level } from "../Level.js";
import { ManualSpawnStrategy, RandomSpawnStrategy } from "../systems/SpawnStrategy.js";
import { CityBackground, ForestBackground } from "../ui/Background.js";
import type { Game } from "../Main.js";
import { GAME_CONFIG } from "./GameConfig.js";
import { manual1Spawn } from "./spawn/Manual1SpawnData.js";

// This function returns an array of Level objects, fully constructed for the game
export function getLevelSequence(game: Game): Level[] {
  return [
    new Level(game, new CityBackground(game), (game: Game) => new ManualSpawnStrategy(game, manual1Spawn)),
    new Level(
      game,
      new ForestBackground(game),
      (game: Game) => new RandomSpawnStrategy(game, GAME_CONFIG.enemyInterval)
    ),
    // Add more levels here as needed
  ];
}
