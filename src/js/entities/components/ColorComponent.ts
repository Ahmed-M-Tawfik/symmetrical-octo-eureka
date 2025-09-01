import type { Component } from "../Component.js";

export class ColorComponent implements Component {
  __isComponent: true = true;
  color: string;
  constructor(color: string) {
    this.color = color;
  }
}
