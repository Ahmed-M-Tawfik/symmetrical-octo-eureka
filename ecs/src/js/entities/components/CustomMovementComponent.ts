import type { Game } from "../../Main.js";
import type { Component } from "../Component.js";
import type { GameEntity } from "../GameEntity.js";

export class CustomMovementComponent implements Component {
  public __isComponent: true = true;

  constructor(
    public movementLogic: (game: Game, entity: GameEntity, deltaTime: number) => void,
    public customMovementState: Record<string, any> = {}
  ) {}
}
