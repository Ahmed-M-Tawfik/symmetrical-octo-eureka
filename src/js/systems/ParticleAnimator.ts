import { GAME_CONFIG } from "../data/GameConfig.js";
import { Dust, Fire, Splash } from "../entities/Particles.js";
import type { Game } from "../Main.js";
import type { GameSession } from "../session/GameSession.js";

export class ParticleAnimator {
  game: Game;
  maxParticles: number;

  constructor(game: Game) {
    this.game = game;
    this.maxParticles = GAME_CONFIG.maxParticles;
  }

  update(deltaTime: number): void {
    this.game.session.particles.forEach((particle: Dust | Fire | Splash) => particle.update());
    // Remove deleted
    for (let i = this.game.session.particles.length - 1; i >= 0; i--) {
      if (this.game.session.particles[i].markedForDeletion) this.game.session.particles.splice(i, 1);
    }
    // truncate to avoid performance issues
    if (this.game.session.particles.length > this.maxParticles) {
      this.game.session.particles.length = this.maxParticles;
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    this.game.session.particles.forEach((particle: Dust | Fire | Splash) => particle.draw(context));
  }

  reset(): void {
    this.game.session.particles.length = 0;
  }

  addDust(x: number, y: number): void {
    this.game.session.particles.unshift(new Dust(this.game, x, y));
  }

  addFire(x: number, y: number): void {
    this.game.session.particles.unshift(new Fire(this.game, x, y));
  }

  addSplash(x: number, y: number): void {
    for (let i = 0; i < 30; i++) {
      this.game.session.particles.unshift(new Splash(this.game, x, y));
    }
  }
}
