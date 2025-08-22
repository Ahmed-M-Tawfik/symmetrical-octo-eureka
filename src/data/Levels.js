import { Level } from "../js/Level.js";
import { CityBackground, ForestBackground } from "../js/Background.js";
import { Manual1SpawnStrategy, RandomSpawnStrategy } from "../js/systems/SpawnStrategy.js";
import { manual1Spawn } from "./spawn/manual1Spawn.js";
import { GAME_CONFIG } from "../js/data/GameConfig.js";

// This function returns an array of Level objects, fully constructed for the game
export function getLevelSequence(game) {
  return [
    new Level(game, new CityBackground(game), (game) => new Manual1SpawnStrategy(game, manual1Spawn)),
    new Level(game, new ForestBackground(game), (game) => new RandomSpawnStrategy(game, GAME_CONFIG.enemyInterval)),
    // Add more levels here as needed
  ];
}
