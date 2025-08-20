export class Level {
  constructor(game, background, spawnStrategyCallback) {
    this.game = game;
    this.background = background;
    this.spawnStrategyCallback = spawnStrategyCallback;
    this.spawnStrategy = null; // to be filled when we start
  }

  start() {
    this.background.start();
    this.spawnStrategy = this.spawnStrategyCallback(this.game);
  }

  update(deltaTime) {
    this.background.update(deltaTime);
  }

  draw(context) {
    this.background.draw(context);
  }
}
