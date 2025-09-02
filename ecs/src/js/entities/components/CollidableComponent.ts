import type { Component } from "../Component";
import type { GameEntity } from "../GameEntity";

export class CollidableComponent implements Component {
  public __isComponent: true = true;
  constructor(public collisionEvents: CollisionEvent[] = []) {}
}

export class CollisionEvent {
  constructor(public readonly collider: GameEntity, public readonly collidedWith: GameEntity) {}
}
