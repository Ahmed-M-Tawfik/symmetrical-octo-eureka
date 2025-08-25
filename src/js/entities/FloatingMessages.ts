import { GameEntity } from "./GameEntity.js";
import type { Game } from "../Main.js";

export class FloatingMessage extends GameEntity {
  value: string;
  targetX: number;
  targetY: number;
  timer: number;

  constructor(value: string, x: number, y: number, targetX: number, targetY: number) {
    super(null as unknown as Game, x, y, 0, 0); // No game ref nor width/height needed
    this.value = value;
    this.targetX = targetX;
    this.targetY = targetY;
    this.timer = 0;
  }

  override update(): void {
    this.x += (this.targetX - this.x) * 0.03;
    this.y += (this.targetY - this.y) * 0.03;
    this.timer++;
    if (this.timer > 100) this.markedForDeletion = true;
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
