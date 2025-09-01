import { Player } from "../entities/Player.js";
import { GAME_CONFIG } from "../data/GameConfig.js";
import type { Game } from "../Main.js";
import { FloatingMessage } from "../entities/FloatingMessages.js";
import type { Enemy } from "../entities/Enemy.js";
import { eventBus } from "../engine/EventBus.js";
import { atIndex } from "../utils/arrayUtils.js";
import type { GameEntity } from "../entities/GameEntity.js";
import { PlayerComponent, PlayerState } from "../entities/components/PlayerComponent.js";
import type { PositionComponent } from "../entities/components/PositionComponent.js";

export class GameSession {
  game: Game;
  entities: GameEntity[] = [];
  player!: Player;
  // particles: Array<Dust | Splash | Fire> = [];
  // enemies: Array<Enemy> = [];
  // collisions: CollisionAnimation[] = [];
  // floatingMessages: FloatingMessage[] = [];
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
    eventBus.on("enemy:collidedWithPlayer", (data) => {
      let enemiesDamagedPlayer: Enemy[] = [];
      let enemiesDefeatedByPlayer: Enemy[] = [];

      const playerComp = this.player.getComponent<PlayerComponent>("state");
      if (!playerComp) return;

      data.enemies.forEach((enemy) => {
        // move this to dedicated system
        if (playerComp.currentState === PlayerState.DIVING || playerComp.currentState === PlayerState.ROLLING) {
          const enemyPos = enemy.getComponent<PositionComponent>("position");
          if (!enemyPos) return;

          this.score++;
          this.entities.push(new FloatingMessage(this.game, "+1", enemyPos.x, enemyPos.y, GAME_CONFIG.floatingMessage));
          enemiesDefeatedByPlayer.push(enemy);
        } else {
          // playerComp.setState(PlayerState.HIT, 0); // implement in player system
          this.lives--;
          enemiesDamagedPlayer.push(enemy);
          if (this.lives <= 0) {
            eventBus.emit("level:lost", {
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
    this.player = new Player(this.game, GAME_CONFIG.player);
    this.entities = [this.player];
    // this.particles = [];
    // this.enemies = [];
    // this.collisions = [];
    // this.floatingMessages = [];
    this.lives = GAME_CONFIG.initialLives;
    this.time = 0;
    this.maxTime = GAME_CONFIG.maxTime;
    this.score = 0;
    this.winningScore = GAME_CONFIG.winningScore;
  }
}
