import { GAME_CONFIG } from "../gameConfig.js";
import { Dust, Fire, Splash } from "../particles.js";

export class ParticleAnimator {
  constructor(game) {
    this.game = game;

    this.particles = [];
    this.maxParticles = GAME_CONFIG.maxParticles;
  }
  update(deltaTime) {
    this.particles.forEach((particle) => particle.update(deltaTime));

    this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
    if (this.particles.length > this.maxParticles) {
      this.particles = this.particles.slice(0, this.maxParticles);
    }
  }
  draw(context) {
    this.particles.forEach((particle) => particle.draw(context));
  }
  addDust(x, y) {
    this.particles.unshift(new Dust(this.game, x, y));
  }
  addFire(x, y) {
    this.particles.unshift(new Fire(this.game, x, y));
  }
  addSplash(x, y) {
    for (let i = 0; i < 30; i++) {
      this.particles.unshift(new Splash(this.game, x, y));
    }
  }
}
