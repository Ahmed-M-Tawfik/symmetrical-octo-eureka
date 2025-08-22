import { Player } from "../entities/Player.js";
import { GAME_CONFIG } from "../data/GameConfig.js";

export class GameSession {
  constructor(game) {
    this.game = game;
    this.reset();
  }

  reset() {
    this.player = new Player(this.game);
    this.particles = [];
    this.enemies = [];
    this.collisions = [];
    this.floatingMessages = [];
    this.lives = GAME_CONFIG.initialLives;
    this.time = 0;
    this.maxTime = GAME_CONFIG.maxTime;
    this.score = 0;
    this.winningScore = GAME_CONFIG.winningScore;
  }
}
