import { Player } from "../entities/Player.js";
import { GAME_CONFIG } from "../data/GameConfig.js";

import type { Game } from "../Main.js";
import { FloatingMessage } from "../entities/FloatingMessages.js";
import { CollisionAnimation } from "../entities/CollisionAnimation.js";
import type { Dust, Splash, Fire } from "../entities/Particles.js";
import type { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "../entities/Enemy.js";
import { eventBus } from "../engine/EventBus.js";
import { Diving, Rolling, states } from "../states/PlayerStates.js";

export class GameSession {
  game: Game;
  player!: Player;
  particles: Array<Dust | Splash | Fire> = [];
  enemies: Array<FlyingEnemy | GroundEnemy | ClimbingEnemy> = [];
  collisions: CollisionAnimation[] = [];
  floatingMessages: FloatingMessage[] = [];
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
    eventBus.on("collision:detected", (data) => {
      this.collisions.push(
        new CollisionAnimation(
          this.game,
          data.entity.x + data.entity.width * 0.5,
          data.entity.y + data.entity.height * 0.5
        )
      );

      if (this.player.currentState instanceof Diving || this.player.currentState instanceof Rolling) {
        this.score++;
        this.floatingMessages.push(new FloatingMessage("+1", data.entity.x, data.entity.y, 100, 50));
      } else {
        this.player.setState(states.HIT, 0);
        this.lives--;
        if (this.lives <= 0) {
          this.game.changeState(this.game.states.gameOver);
        }
      }
    });
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
