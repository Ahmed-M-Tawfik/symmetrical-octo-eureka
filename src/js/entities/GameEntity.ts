import type { Game } from "../Main.js";
import type { Component } from "./Component.js";

export class GameEntity {
  game: Game;
  private components: Map<string, Component> = new Map();

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * Add a component to this entity. Key is usually the component's class name.
   */
  addComponent<T extends Component>(key: string, component: T): void {
    this.components.set(key, component);
  }

  /**
   * Remove a component by key.
   */
  removeComponent(key: string): void {
    this.components.delete(key);
  }

  /**
   * Get a component by key.
   */
  getComponent<T extends Component = Component>(key: string): T | undefined {
    return this.components.get(key) as T | undefined;
  }

  /**
   * List all component keys. Mainly for debug purposes
   * @returns An array of component keys.
   */
  listComponentKeys(): string[] {
    return Array.from(this.components.keys());
  }

  debug(): void {
    console.log("Debugging GameEntity:");
    this.components.forEach((component, key) => {
      console.log(` - ${key}:`, component);
    });
  }

  // No per-component update. Systems should handle updates.
}
