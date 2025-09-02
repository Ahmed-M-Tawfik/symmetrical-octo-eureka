import type { Component } from "../Component.js";

export class DeleteIfOutOfBoundsComponent implements Component {
  public __isComponent: true = true;
  constructor(
    public leftBound: number | undefined = 0,
    public rightBound: number | undefined = undefined,
    public topBound: number | undefined = undefined,
    public bottomBound: number | undefined = undefined
  ) {}
}
