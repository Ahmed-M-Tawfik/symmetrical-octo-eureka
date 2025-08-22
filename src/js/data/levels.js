import { Level } from "../level.js";
import { CityBackground, ForestBackground } from "../background.js";
import { Manual1SpawnStrategy, RandomSpawnStrategy } from "../systems/levelSpawner.js";
import { manual1Spawn } from "./spawn/manual1Spawn.js";
import { GAME_CONFIG } from "./gameConfig.js";

// This function returns an array of Level objects, fully constructed for the game
export function getLevelSequence(game) {
  return [
    new Level(game, new CityBackground(game), (game) => new Manual1SpawnStrategy(game, manual1Spawn)),
    new Level(game, new ForestBackground(game), (game) => new RandomSpawnStrategy(game, GAME_CONFIG.enemyInterval)),
    // Add more levels here as needed
  ];
}
