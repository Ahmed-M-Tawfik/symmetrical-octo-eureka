import type { Game } from "../Main.js";
import { AssetManager } from "../systems/AssetManager.js";
import { scaledDeltaTime } from "../utils/timeUtils.js";

export interface IBackgroundLayerConfig {
  imageName: string;
  speed: number;
}

class Layer {
  game: Game;
  width: number;
  height: number;
  speedModifier: number;
  image: HTMLImageElement;
  x: number;
  y: number;
  constructor(game: Game, width: number, height: number, speedModifier: number, image: HTMLImageElement) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }
  update(deltaTime: number): void {
    const scaled = scaledDeltaTime(this.game, deltaTime);
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier * scaled;
  }
  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
}

export class Background {
  game: Game;
  width: number;
  height: number;
  groundMargin: number;
  layers: Layer[];
  constructor(
    game: Game,
    width: number,
    height: number,
    groundMargin: number,
    backgroundLayers: IBackgroundLayerConfig[] = [
      { imageName: "layer1", speed: 0.15 },
      { imageName: "layer2", speed: 0.2 },
      { imageName: "layer3", speed: 0.4 },
      { imageName: "layer4", speed: 0.6 },
      { imageName: "layer5", speed: 1 },
    ]
  ) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.groundMargin = groundMargin;
    this.layers = [];
    backgroundLayers.forEach((layer) => {
      const layerInstance = new Layer(
        this.game,
        this.width,
        this.height,
        layer.speed,
        AssetManager.getImage(layer.imageName)
      );
      this.layers.push(layerInstance);
    });
  }
  start(): void {
    this.game.groundMargin = this.groundMargin;
    this.layers.forEach((layer) => {
      layer.x = 0;
    });
  }
  update(deltaTime: number): void {
    this.layers.forEach((layer) => {
      layer.update(deltaTime);
    });
  }
  draw(context: CanvasRenderingContext2D): void {
    this.layers.forEach((layer) => {
      layer.draw(context);
    });
  }
}

export class ForestBackground extends Background {
  constructor(game: Game) {
    super(game, 1667, 500, 40, [
      { imageName: "bglayer1-forest", speed: 0.15 },
      { imageName: "bglayer2-forest", speed: 0.2 },
      { imageName: "bglayer3-forest", speed: 0.4 },
      { imageName: "bglayer4-forest", speed: 0.6 },
      { imageName: "bglayer5-forest", speed: 1 },
    ]);
  }
}

export class CityBackground extends Background {
  constructor(game: Game) {
    super(game, 1667, 500, 80, [
      { imageName: "bglayer1-city", speed: 0.15 },
      { imageName: "bglayer2-city", speed: 0.2 },
      { imageName: "bglayer3-city", speed: 0.4 },
      { imageName: "bglayer4-city", speed: 0.6 },
      { imageName: "bglayer5-city", speed: 1 },
    ]);
  }
}
