import type { Component } from "../Component.js";

export class EnemyComponent implements Component {
  public __isComponent: true = true;
  constructor(public enemyType: string) {}
}
