import { Player } from "../entities/Player.js";
import { GAME_CONFIG } from "../data/GameConfig.js";

import type { Game } from "../Main.js";
import { FloatingMessage } from "../entities/FloatingMessages.js";
import { CollisionAnimation } from "../entities/CollisionAnimation.js";
import type { Dust, Splash, Fire } from "../entities/Particles.js";
import type { Enemy } from "../entities/Enemy.js";
import { eventBus } from "../engine/EventBus.js";
import { Diving, Rolling, states } from "../states/PlayerStates.js";
import { atIndex } from "../utils/arrayUtils.js";

export class GameSession {
  game: Game;
  player!: Player;
  particles: Array<Dust | Splash | Fire> = [];
  enemies: Array<Enemy> = [];
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
    eventBus.on("enemy:collisionWithPlayer", (data) => {
      let enemiesDamagedPlayer: Enemy[] = [];
      let enemiesDefeatedByPlayer: Enemy[] = [];

      data.enemies.forEach((enemy) => {
        if (this.player.currentState instanceof Diving || this.player.currentState instanceof Rolling) {
          this.score++;
          this.floatingMessages.push(new FloatingMessage("+1", enemy.x, enemy.y, 100, 50));
          enemiesDefeatedByPlayer.push(enemy);
        } else {
          this.player.setState(states.HIT, 0);
          this.lives--;
          enemiesDamagedPlayer.push(enemy);
          if (this.lives <= 0) {
            eventBus.emit("level:fail", {
              levelId: this.game.currentGameLevel,
              level: atIndex(this.game.gameLevels, this.game.currentGameLevel),
            });
          }
        }
      });

      if (enemiesDamagedPlayer.length > 0) {
        eventBus.emit("enemy:damagedPlayer", { enemies: enemiesDamagedPlayer, player: this.player });
      }
      if (enemiesDefeatedByPlayer.length > 0) {
        eventBus.emit("enemy:defeatedByPlayer", { enemies: enemiesDefeatedByPlayer, player: this.player });
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
