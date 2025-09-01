import type { Component } from "../Component.js";

// todo: find reason to use, or remove
export class TimerComponent implements Component {
  public __isComponent: true = true;
  time: number = 0;
  constructor() {}
}
