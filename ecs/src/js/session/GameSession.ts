import type { Game } from "../Main.js";
import { GAME_CONFIG } from "../data/GameConfig.js";
import { eventBus } from "../engine/EventBus.js";
import type { GameEntity } from "../entities/GameEntity.js";
import { Player } from "../entities/Player.js";

export class GameSession {
  game: Game;
  entities: GameEntity[] = [];
  player!: Player;
  lives: number = 0;
  time: number = 0;
  maxTime: number = 0;
  score: number = 0;
  winningScore: number = 0;

  constructor(game: Game) {
    this.game = game;
    this.reset();

    eventBus.on("test:debug_add_score", () => {
      this.score += 10;
    });
  }

  reset(): void {
    this.player = new Player(this.game, GAME_CONFIG.player);
    this.entities = [this.player];
    this.lives = GAME_CONFIG.initialLives;
    this.time = 0;
    this.maxTime = GAME_CONFIG.maxTime;
    this.score = 0;
    this.winningScore = GAME_CONFIG.winningScore;
  }
}
