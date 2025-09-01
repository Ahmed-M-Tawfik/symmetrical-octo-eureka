import type { Component } from "../Component.js";

export class HealthComponent implements Component {
  public __isComponent: true = true;
  constructor(public maxHealth: number, public currentHealth: number) {}
  takeDamage(amount: number) {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
  }
  isAlive(): boolean {
    return this.currentHealth > 0;
  }
}
