import type { Component } from "../Component.js";

export class ValueComponent implements Component {
  public __isComponent: true = true;
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}
