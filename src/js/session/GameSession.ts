import { Player } from "../entities/Player.js";
import { GAME_CONFIG } from "../data/GameConfig.js";

import type { Game } from "../Main.js";
import type { FloatingMessage } from "../entities/FloatingMessages.js";
import type { CollisionAnimation } from "../entities/CollisionAnimation.js";
import type { Dust, Splash, Fire } from "../entities/Particles.js";
import type { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "../entities/Enemy.js";

export class GameSession {
  game: Game;
  player: Player;
  particles: Array<Dust | Splash | Fire>;
  enemies: Array<FlyingEnemy | GroundEnemy | ClimbingEnemy>;
  collisions: CollisionAnimation[];
  floatingMessages: FloatingMessage[];
  lives: number;
  time: number;
  maxTime: number;
  score: number;
  winningScore: number;

  constructor(game: Game) {
    this.game = game;
    this.reset();
  }

  reset(): void {
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
