import type { Component } from "../Component";

export type ParticleEffectType = "dust" | "fire" | "splash";

export class ParticleRequest {
  constructor(public type: ParticleEffectType, public x: number, public y: number) {}
}

export class ParticleRequestComponent implements Component {
  public __isComponent: true = true;

  constructor(public requests: ParticleRequest[] = []) {}
}
