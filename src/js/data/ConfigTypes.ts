// Shared config and data types for the game

// Spawn data for manual and scripted enemy spawns
export interface ISpawnData {
  time: number;
  type: string;
  x: number;
  y: number;
  speed: number;
  // Extend this interface for additional spawn data as needed
}

export interface IGameConfig {
  // window
  canvasWidth: number;
  canvasHeight: number;

  // player
  player: {
    width: number;
    height: number;
    maxSpeed: number;
    weight: number;
    spriteWidth: number;
    spriteHeight: number;
    maxFrame: number;
    imageId: string;
  };

  // collision animation
  collisionAnimation: {
    spriteWidth: number;
    spriteHeight: number;
    sizeModifierMin: number;
    sizeModifierMax: number;
    frameIntervalMin: number;
    frameIntervalMax: number;
    maxFrame: number;
    imageId: string;
  };

  // environment
  backgroundSpeed: number;
  enemyInterval: number;
  maxParticles: number;
  maxTime: number;
  winningScore: number;
  initialLives: number;
}

export interface IEnemyConfig {
  width: number;
  height: number;
  spriteWidth: number;
  spriteHeight: number;
  maxFrame: number;
  imageId: string;
  speedX?: number | { min: number; max: number };
  speedY?: number | { min: number; max: number };
  va?: number | { min: number; max: number };
  // Extend this interface for additional enemy config as needed
}

export interface IParticleConfig {
  size: { min: number; max: number };
  color?: string;
  shrink: number;
  speedX?: number | { min: number; max: number };
  speedY?: number | { min: number; max: number };
  gravity?: number;
  va?: number | { min: number; max: number };
  imageId?: string;
  // Extend this interface for additional particle config as needed
}

export interface IKeyBinding {
  action: string;
  key: string;
  group: string;
}
