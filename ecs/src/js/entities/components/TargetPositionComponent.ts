import type { Component } from "../Component.js";

export class TargetPositionComponent implements Component {
  public __isComponent: true = true;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
