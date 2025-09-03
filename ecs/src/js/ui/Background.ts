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
  bglayers: Layer[];
  fglayers: Layer[];
  constructor(
    game: Game,
    width: number,
    height: number,
    groundMargin: number,
    backgroundLayers: IBackgroundLayerConfig[],
    foregroundLayers: IBackgroundLayerConfig[] = []
  ) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.groundMargin = groundMargin;
    this.bglayers = [];
    this.fglayers = [];
    backgroundLayers.forEach((layer) => {
      const layerInstance = new Layer(
        this.game,
        this.width,
        this.height,
        layer.speed,
        AssetManager.getImage(layer.imageName)
      );
      this.bglayers.push(layerInstance);
    });
    foregroundLayers.forEach((layer) => {
      const layerInstance = new Layer(
        this.game,
        this.width,
        this.height,
        layer.speed,
        AssetManager.getImage(layer.imageName)
      );
      this.fglayers.push(layerInstance);
    });
  }
  start(): void {
    this.game.groundMargin = this.groundMargin;
    [...this.bglayers, ...this.fglayers].forEach((layer) => {
      layer.x = 0;
    });
  }
  update(deltaTime: number): void {
    [...this.bglayers, ...this.fglayers].forEach((layer) => {
      layer.update(deltaTime);
    });
  }
  drawBackground(context: CanvasRenderingContext2D): void {
    this.bglayers.forEach((layer) => {
      layer.draw(context);
    });
  }
  drawForeground(context: CanvasRenderingContext2D): void {
    this.fglayers.forEach((layer) => {
      layer.draw(context);
    });
  }
}

export class ForestBackground extends Background {
  constructor(game: Game) {
    super(
      game,
      1667,
      500,
      40,
      [
        { imageName: "bglayer1-forest", speed: 0.15 },
        { imageName: "bglayer2-forest", speed: 0.2 },
        { imageName: "bglayer3-forest", speed: 0.4 },
        { imageName: "bglayer4-forest", speed: 0.6 },
        { imageName: "bglayer5-forest", speed: 1 },
      ],
      [{ imageName: "fglayer-forest", speed: 2 }]
    );
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
