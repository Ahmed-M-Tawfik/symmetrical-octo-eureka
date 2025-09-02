import type { Component } from "../Component.js";

export class LifetimeComponent implements Component {
  public __isComponent: true = true;
  // Lifetime in milliseconds
  constructor(public maxLifetimeMs: number, public elapsedLifetimeMs: number = 0) {}
}
