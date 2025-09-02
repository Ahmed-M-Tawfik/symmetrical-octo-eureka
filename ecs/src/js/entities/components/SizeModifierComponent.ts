import type { Component } from "../Component.js";

export class SizeModifierComponent implements Component {
  public __isComponent: true = true;
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}
