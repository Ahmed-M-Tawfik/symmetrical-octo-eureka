import type { Game } from "../../Main.js";
import type { Component } from "../Component.js";
import type { GameEntity } from "../GameEntity.js";

export class CustomDrawComponent implements Component {
  public __isComponent: true = true;

  constructor(
    public draw: (game: Game, context: CanvasRenderingContext2D, entity: GameEntity, deltaTime: number) => void,
    public customDrawState: Record<string, any> = {}
  ) {}
}
