import type { Component } from "../Component.js";
import type { PlayerState } from "./PlayerComponent.js";

export class PlayerStateChangeRequestComponent implements Component {
  public __isComponent: true = true;

  constructor(public nextState: PlayerState) {}
}
