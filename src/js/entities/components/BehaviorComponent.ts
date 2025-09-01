import type { Component } from "../Component.js";

export class BehaviorComponent implements Component {
  public __isComponent: true = true;
  constructor(public behaviorFn: (entity: any, deltaTime: number) => void) {}
}
