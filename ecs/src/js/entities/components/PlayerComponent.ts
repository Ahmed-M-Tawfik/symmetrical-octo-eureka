import type { Component } from "../Component.js";

export enum PlayerState {
  SITTING,
  RUNNING,
  JUMPING,
  FALLING,
  ROLLING,
  DIVING,
  HIT,
}
export const initialState: PlayerState = PlayerState.SITTING;
export const states: typeof PlayerState = PlayerState;

export class PlayerComponent implements Component {
  public __isComponent: true = true;

  constructor(public currentState: PlayerState) {}
}
