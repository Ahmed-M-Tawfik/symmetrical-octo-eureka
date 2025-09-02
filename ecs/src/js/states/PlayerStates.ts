// import type { Game } from "../Main.js";
// import { states, type Player } from "../entities/Player.js";
// import { PlayerComponent } from "../entities/components/PlayerComponent.js";
// import { AnimationFrameSystem } from "../../systems/AnimationFrameSystem.js";

// export const states = {
//   SITTING: 0,
//   RUNNING: 1,
//   JUMPING: 2,
//   FALLING: 3,
//   ROLLING: 4,
//   DIVING: 5,
//   HIT: 6,
// };

// export const playerActions = {
//   moveLeft: "moveLeft",
//   moveRight: "moveRight",
//   jump: "jump",
//   down: "down",
//   roll: "roll",
// };

// export class PlayerState {
//   game: Game;

//   constructor(public state: number, public player: Player) {
//     this.game = player.game;
//   }
//   enter(): void {}
//   handleInput(inputActions: Set<string>): void {}
// }
// export class Sitting extends PlayerState {
//   constructor(player: Player) {
//     super(states.SITTING, player);
//   }
//   override enter(): void {
//     AnimationFrameSystem(this.player, 5, 4);
//     const playerComp = this.player.getComponent<PlayerComponent>("player");
//     if (playerComp) playerComp.speed = 0;
//   }
//   override handleInput(inputActions: Set<string>): void {
//     // Pure logic only; transitions handled by PlayerStateSystem
//   }
// }
// export class Running extends PlayerState {
//   constructor(player: Player) {
//     super(states.RUNNING, player);
//   }
//   override enter(): void {
//     AnimationFrameSystem(this.player, 3, 8);
//   }
//   override handleInput(inputActions: Set<string>): void {
//     // Pure logic only; transitions handled by PlayerStateSystem
//   }
// }
// export class Jumping extends PlayerState {
//   constructor(player: Player) {
//     super(states.JUMPING, player);
//   }
//   override enter(): void {
//     const playerComp = this.player.getComponent<PlayerComponent>("player");
//     if (this.player.onGround() && playerComp) playerComp.vy = -27;
//     AnimationFrameSystem(this.player, 1, 6);
//   }
//   override handleInput(inputActions: Set<string>): void {
//     // Pure logic only; transitions handled by PlayerStateSystem
//   }
// }
// export class Falling extends PlayerState {
//   constructor(player: Player) {
//     super(states.FALLING, player);
//   }
//   override enter(): void {
//     AnimationFrameSystem(this.player, 2, 6);
//   }
//   override handleInput(inputActions: Set<string>): void {
//     // Pure logic only; transitions handled by PlayerStateSystem
//   }
// }
// export class Rolling extends PlayerState {
//   constructor(player: Player) {
//     super(states.ROLLING, player);
//   }
//   override enter(): void {
//     AnimationFrameSystem(this.player, 6, 6);
//   }
//   override handleInput(inputActions: Set<string>): void {
//     // Pure logic only; transitions handled by PlayerStateSystem
//   }
// }
// export class Diving extends PlayerState {
//   constructor(player: Player) {
//     super(states.DIVING, player);
//   }
//   override enter(): void {
//     AnimationFrameSystem(this.player, 6, 6);
//     const playerComp = this.player.getComponent<PlayerComponent>("player");
//     if (playerComp) playerComp.vy = 30;
//   }
//   override handleInput(inputActions: Set<string>): void {
//     // Pure logic only; transitions handled by PlayerStateSystem
//   }
// }
// export class Hit extends PlayerState {
//   constructor(player: Player) {
//     super(states.HIT, player);
//   }
//   override enter(): void {
//     AnimationFrameSystem(this.player, 4, 10);
//   }
//   override handleInput(inputActions: Set<string>): void {
//     // Pure logic only; transitions handled by PlayerStateSystem
//   }
// }
