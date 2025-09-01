import type { Component } from "../Component.js";

export class CollisionComponent implements Component {
  public __isComponent: true = true;
  constructor(
    public offsetX: number = 0,
    public offsetY: number = 0,
    public width: number = 0,
    public height: number = 0
  ) {}
}
