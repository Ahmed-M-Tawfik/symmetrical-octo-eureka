import { GAME_CONFIG } from "../data/gameConfig.js";
import { Dust, Fire, Splash } from "../entities/particles.js";

export class ParticleAnimator {
  constructor(game) {
    this.game = game;
    this.maxParticles = GAME_CONFIG.maxParticles;
  }
  update(deltaTime) {
    this.game.session.particles.forEach((particle) => particle.update(deltaTime));
    // Remove deleted
    for (let i = this.game.session.particles.length - 1; i >= 0; i--) {
      if (this.game.session.particles[i].markedForDeletion) this.game.session.particles.splice(i, 1);
    }
    if (this.game.session.particles.length > this.maxParticles) {
      this.game.session.particles.length = this.maxParticles;
    }
  }
  draw(context) {
    this.game.session.particles.forEach((particle) => particle.draw(context));
  }
  reset() {
    this.game.session.particles.length = 0;
  }
  addDust(x, y) {
    this.game.session.particles.unshift(new Dust(this.game, x, y));
  }
  addFire(x, y) {
    this.game.session.particles.unshift(new Fire(this.game, x, y));
  }
  addSplash(x, y) {
    for (let i = 0; i < 30; i++) {
      this.game.session.particles.unshift(new Splash(this.game, x, y));
    }
  }
}
