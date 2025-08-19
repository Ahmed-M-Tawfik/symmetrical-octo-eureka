import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "../enemies.js";

export class SpawnStrategy {
  constructor(game) {
    this.game = game;
  }
  update(deltaTime) {}
}

export class RandomSpawnStrategy extends SpawnStrategy {
  constructor(game, enemyInterval = 1000) {
    super(game);

    this.enemyTimer = 0;
    this.enemyInterval = enemyInterval;
  }
  update(deltaTime) {
    super.update(deltaTime);

    this.enemyTimer += deltaTime;

    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    }
  }
  addEnemy() {
    if (this.game.speed > 0 && Math.random() < 0.5) {
      this.game.enemies.push(new GroundEnemy(this.game));
    } else if (this.game.speed > 0) {
      this.game.enemies.push(new ClimbingEnemy(this.game));
    }
    this.game.enemies.push(new FlyingEnemy(this.game));
  }
}

export class Manual1SpawnStrategy extends SpawnStrategy {
  /**
   * spawnSchedule: Array of objects like:
   * { time: ms, type: 'FlyingEnemy'|'ClimbingEnemy'|'GroundEnemy', x: number, y: number, speed: number }
   */
  constructor(
    game,
    spawnSchedule = [
      // example
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

  update(deltaTime) {
    super.update(deltaTime);
    this.enemyTimer += deltaTime;

    // Spawn all enemies whose time has come
    while (
      this.nextSpawnIndex < this.spawnSchedule.length &&
      this.enemyTimer >= this.spawnSchedule[this.nextSpawnIndex].time
    ) {
      const event = this.spawnSchedule[this.nextSpawnIndex];
      this.addEnemy(event);
      this.nextSpawnIndex++;
    }
  }

  addEnemy(event) {
    let enemy;
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
    // Set position and speed if possible
    enemy.x = this.game.width + event.x;
    enemy.y = event.y;
    enemy.speedX = event.speed;
    this.game.enemies.push(enemy);
  }
}
