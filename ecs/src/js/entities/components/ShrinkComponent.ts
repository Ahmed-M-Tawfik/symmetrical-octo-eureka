import type { Component } from "../Component.js";

export class ShrinkComponent implements Component {
  public __isComponent: true = true;
  shrink: number;
  constructor(shrink: number) {
    this.shrink = shrink;
  }
}
