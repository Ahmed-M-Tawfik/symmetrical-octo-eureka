import type { Component } from "../Component";

export class ImageComponent implements Component {
  public __isComponent: true = true;
  constructor(public image: HTMLImageElement) {}
}
