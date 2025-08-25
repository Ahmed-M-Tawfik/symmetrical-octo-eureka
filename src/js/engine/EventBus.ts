import type { GameEventMap } from "./GameEventMap";

export type EventHandler<Payload> = (payload: Payload) => void;

export class EventBus<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: Set<EventHandler<Events[K]>>;
  } = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]!.add(handler);
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    this.listeners[event]?.delete(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    console.log(`Event emitted`, event, payload);
    this.listeners[event]?.forEach((handler) => handler(payload));
  }

  clear(): void {
    (Object.keys(this.listeners) as (keyof Events)[]).forEach((event) => {
      this.listeners[event]?.clear();
    });
  }
}

export const eventBus = new EventBus<GameEventMap>();
