import type { Component } from "../Component.js";

export type PowerupType = "life" | "score";

export class PowerupComponent implements Component {
  public __isComponent: true = true;
  constructor(
    public type: PowerupType,
    public value: number // e.g., +1 life, +100 score
  ) {}
}
