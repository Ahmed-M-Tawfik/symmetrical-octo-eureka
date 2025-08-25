import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "../entities/Enemy.js";

import type { Game } from "../Main.js";
import type { ISpawnData } from "../data/ConfigTypes.js";

export class SpawnStrategy {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }
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
  update(deltaTime: number): void {
    super.update(deltaTime);
    this.enemyTimer += deltaTime;
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    }
  }
  addEnemy(): void {
    if (this.game.speed > 0 && Math.random() < 0.5) {
      this.game.session.enemies.push(new GroundEnemy(this.game));
    } else if (this.game.speed > 0) {
      this.game.session.enemies.push(new ClimbingEnemy(this.game));
    }
    this.game.session.enemies.push(new FlyingEnemy(this.game));
  }
}

export class Manual1SpawnStrategy extends SpawnStrategy {
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

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.enemyTimer += deltaTime;
    while (
      this.nextSpawnIndex < this.spawnSchedule.length &&
      this.enemyTimer >= this.spawnSchedule[this.nextSpawnIndex].time
    ) {
      const event = this.spawnSchedule[this.nextSpawnIndex];
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
        return;
    }
    enemy.x = this.game.width + event.x;
    enemy.y = event.y;
    enemy.speedX = event.speed;
    this.game.session.enemies.push(enemy);
  }
}
