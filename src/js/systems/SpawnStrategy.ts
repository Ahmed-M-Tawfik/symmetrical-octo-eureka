import { atIndex } from "../utils/arrayUtils.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, Enemy } from "../entities/Enemy.js";

import type { Game } from "../Main.js";
import type { ISpawnData } from "../data/ConfigTypes.js";
import { eventBus } from "../engine/EventBus.js";
import { PositionComponent } from "../entities/components/PositionComponent.js";

export class SpawnStrategy {
  game: Game;
  /**
   * NO CALLS TO GAME TO BE MADE IN CONSTRUCTOR
   * Use start() instead
   */
  constructor(game: Game) {
    this.game = game;
  }
  start(): void {}
  update(deltaTime: number): void {}
}

export class RandomSpawnStrategy extends SpawnStrategy {
  enemyTimer: number;
  enemyInterval: number;
  constructor(game: Game, enemyInterval: number = 1000) {
    super(game);
    this.enemyTimer = 0;
    this.enemyInterval = enemyInterval;
  }
  override update(deltaTime: number): void {
    super.update(deltaTime);
    this.enemyTimer += deltaTime;
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer -= this.enemyInterval;
    }
  }
  addEnemy(): void {
    let spawnedEnemies: Enemy[] = [];
    if (this.game.speed > 0 && Math.random() < 0.5) {
      spawnedEnemies.push(new GroundEnemy(this.game));
    } else if (this.game.speed > 0) {
      spawnedEnemies.push(new ClimbingEnemy(this.game));
    }
    spawnedEnemies.push(new FlyingEnemy(this.game));

    this.game.session.entities.push(...spawnedEnemies);
    eventBus.emit("enemy:spawned", { enemies: spawnedEnemies });
  }
}

export class ManualSpawnStrategy extends SpawnStrategy {
  enemyTimer: number;
  spawnSchedule: ISpawnData[];
  nextSpawnIndex: number;
  constructor(
    game: Game,
    spawnSchedule: ISpawnData[] = [
      { time: 0, type: "FlyingEnemy", x: 0, y: 0, speed: 2 },
      { time: 0, type: "FlyingEnemy", x: 0, y: 100, speed: 2 },
      { time: 0, type: "FlyingEnemy", x: 0, y: 200, speed: 2 },
      { time: 0, type: "FlyingEnemy", x: 20, y: 0, speed: 2 },
      { time: 0, type: "FlyingEnemy", x: 20, y: 100, speed: 2 },
      { time: 0, type: "FlyingEnemy", x: 20, y: 200, speed: 2 },
    ]
  ) {
    super(game);
    this.enemyTimer = 0;
    this.spawnSchedule = spawnSchedule.sort((a, b) => a.time - b.time);
    this.nextSpawnIndex = 0;
  }

  override update(deltaTime: number): void {
    super.update(deltaTime);
    this.enemyTimer += deltaTime;
    while (
      this.nextSpawnIndex < this.spawnSchedule.length &&
      this.enemyTimer >= atIndex(this.spawnSchedule, this.nextSpawnIndex).time
    ) {
      const event = atIndex(this.spawnSchedule, this.nextSpawnIndex);
      this.addEnemy(event);
      this.nextSpawnIndex++;
    }
  }

  addEnemy(event: ISpawnData): void {
    let enemy: FlyingEnemy | GroundEnemy | ClimbingEnemy;
    switch (event.type) {
      case "FlyingEnemy":
        enemy = new FlyingEnemy(this.game, this.game.width + event.x, event.y, event.speed, 0.1);
        break;
      case "ClimbingEnemy":
        enemy = new ClimbingEnemy(this.game);
        break;
      case "GroundEnemy":
        enemy = new GroundEnemy(this.game);
        break;
      default:
        throw new Error(`Unknown enemy type: ${event.type}`);
    }
    const position = enemy.getComponent<PositionComponent>("position");
    if (position) {
      position.x = this.game.width + event.x;
      position.y = event.y;
    }
    this.game.session.entities.push(enemy);

    eventBus.emit("enemy:spawned", { enemies: [enemy] });
  }
}
