import { GameEntity } from "./GameEntity.js";

export class FloatingMessage extends GameEntity {
  constructor(value, x, y, targetX, targetY) {
    super(null, x, y, 0, 0); // No game ref, no width/height needed
    this.value = value;
    this.targetX = targetX;
    this.targetY = targetY;
    this.timer = 0;
  }
  update() {
    this.x += (this.targetX - this.x) * 0.03;
    this.y += (this.targetY - this.y) * 0.03;
    this.timer++;
    if (this.timer > 100) this.markedForDeletion = true;
  }
  draw(context) {
    context.save();
    context.font = "20px Creepster";
    context.fillStyle = "white";
    context.fillText(this.value, this.x, this.y);
    context.fillStyle = "black";
    context.fillText(this.value, this.x - 2, this.y - 2);
    context.restore();
  }
}
