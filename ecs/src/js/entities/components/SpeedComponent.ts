import type { Component } from "../Component.js";

export class SpeedComponent implements Component {
  __isComponent: true = true;

  constructor(public speedX: number, public maxSpeed: number, public speedY: number, public weight: number) {}
}
