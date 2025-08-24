import { Level } from "../Level.js";
import { CityBackground, ForestBackground } from "../ui/Background.js";
import { Manual1SpawnStrategy, RandomSpawnStrategy } from "../systems/SpawnStrategy.js";
import { manual1Spawn } from "./spawn/Manual1SpawnData.js";
import { GAME_CONFIG } from "./GameConfig.js";

// This function returns an array of Level objects, fully constructed for the game
export function getLevelSequence(game) {
  return [
    new Level(game, new CityBackground(game), (game) => new Manual1SpawnStrategy(game, manual1Spawn)),
    new Level(game, new ForestBackground(game), (game) => new RandomSpawnStrategy(game, GAME_CONFIG.enemyInterval)),
    // Add more levels here as needed
  ];
}
