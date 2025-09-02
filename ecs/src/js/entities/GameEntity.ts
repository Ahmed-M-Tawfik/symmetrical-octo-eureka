import type { Game } from "../Main.js";
import type { Component } from "./Component.js";

export class GameEntity {
  game: Game;
  public id: string;
  private components: Map<string, Component> = new Map();

  constructor(game: Game) {
    this.game = game;
    const prefix = this.constructor.name.toLowerCase();
    this.id = `${prefix} ${uuidv4()}`;
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

function uuidv4(): string {
  // Generate a RFC4122 version 4 UUID (browser-safe)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = crypto.getRandomValues(new Uint8Array(1))[0]! & 15;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
