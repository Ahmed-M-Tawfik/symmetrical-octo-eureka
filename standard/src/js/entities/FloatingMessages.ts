import { GameEntity } from "./GameEntity.js";
import type { Game } from "../Main.js";
import { scaleDeltaTime } from "../utils/timeUtils.js";

const lifetimeMs = 2000;

export class FloatingMessage extends GameEntity {
  value: string;
  targetX: number;
  targetY: number;
  timer: number;

  constructor(game: Game, value: string, x: number, y: number, targetX: number, targetY: number) {
    super(game, x, y, 0, 0);
    this.value = value;
    this.targetX = targetX;
    this.targetY = targetY;
    this.timer = 0;
  }

  override update(deltaTime: number): void {
    const scaled = scaleDeltaTime(deltaTime, this.game);
    this.x += (this.targetX - this.x) * 0.03 * scaled;
    this.y += (this.targetY - this.y) * 0.03 * scaled;
    this.timer += deltaTime;
    if (this.timer > lifetimeMs) this.markedForDeletion = true;
  }

  override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.font = "20px Creepster";
    context.fillStyle = "white";
    context.fillText(this.value, this.x, this.y);
    context.fillStyle = "black";
    context.fillText(this.value, this.x - 2, this.y - 2);
    context.restore();
  }
}
