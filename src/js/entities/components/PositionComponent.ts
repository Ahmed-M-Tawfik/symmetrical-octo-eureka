import type { Component } from "../Component.js";

export class PositionComponent implements Component {
  public __isComponent: true = true;
  constructor(public x: number = 0, public y: number = 0) {}
}
