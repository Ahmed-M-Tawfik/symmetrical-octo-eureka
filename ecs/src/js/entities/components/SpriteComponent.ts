import type { Component } from "../Component.js";

export class SpriteComponent implements Component {
  public __isComponent: true = true;

  constructor(
    public frameX: number,
    public frameY: number,
    public maxFrame: number,
    public frameInterval: number,
    public spriteWidth: number,
    public spriteHeight: number,
    public image: HTMLImageElement,
    public frameTimer: number = 0
  ) {}
}
