export const PARTICLE_CONFIG = {
  dust: {
    size: { min: 10, max: 20 },
    color: "rgba(0,0,0,0.2)",
    shrink: 0.97,
  },
  splash: {
    size: { min: 10, max: 60 },
    speedX: { min: -3, max: 3 },
    speedY: { min: 2, max: 4 },
    gravity: 0.1,
    shrink: 0.97,
    imageId: "fire",
  },
  fire: {
    size: { min: 50, max: 150 },
    speedX: 1,
    speedY: 1,
    va: { min: -0.1, max: 0.1 },
    shrink: 0.97,
    imageId: "fire",
  },
};
export const ENEMY_CONFIG = {
  flying: {
    width: 60,
    height: 44,
    spriteWidth: 60,
    spriteHeight: 44,
    maxFrame: 4,
    imageId: "enemy_fly",
    speedX: { min: 1, max: 2 },
    va: { min: 0.1, max: 0.2 },
  },
  ground: {
    width: 60,
    height: 87,
    spriteWidth: 60,
    spriteHeight: 87,
    maxFrame: 1,
    imageId: "enemy_plant",
    speedX: 0,
  },
  climbing: {
    width: 120,
    height: 144,
    spriteWidth: 120,
    spriteHeight: 144,
    maxFrame: 5,
    imageId: "enemy_spider_big",
    speedX: 0,
    speedY: { min: -1, max: 1 },
  },
};
export const GAME_CONFIG = {
  // window
  canvasWidth: 900,
  canvasHeight: 500,

  // player
  player: {
    width: 100,
    height: 91.3,
    maxSpeed: 10,
    weight: 1,
    spriteWidth: 575,
    spriteHeight: 525,
    maxFrame: 5,
    imageId: "player",
  },

  // collision animation
  collisionAnimation: {
    spriteWidth: 100,
    spriteHeight: 90,
    sizeModifierMin: 0.5,
    sizeModifierMax: 1.5, // Math.random() + 0.5
    frameIntervalMin: 5,
    frameIntervalMax: 15, // Math.random() * 10 + 5
    maxFrame: 4,
    imageId: "collisionAnimation",
  },

  // environment
  backgroundSpeed: 3,
  enemyInterval: 1000,
  maxParticles: 200,
  maxTime: 10000,
  winningScore: 5,
  initialLives: 5,
};
