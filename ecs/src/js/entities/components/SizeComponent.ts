import type { Component } from "../Component.js";

export class SizeComponent implements Component {
  public __isComponent: true = true;
  constructor(public width: number = 0, public height: number = 0) {}
}
