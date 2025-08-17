import { Dust, Fire, Splash } from "./particles.js";

export const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class State {
  constructor(state, player) {
    this.state = state;
    this.player = player;
    this.game = player.game;
  }
  enter() {}
  handleInput(input) {}
}
export class Sitting extends State {
  constructor(player) {
    super(states.SITTING, player);
  }
  enter() {
    resetFrames(this.player, 5, 4);
  }
  handleInput(input) {
    if (input.includes("ArrowRight") || input.includes("ArrowLeft")) {
      this.player.setState(states.RUNNING, 1);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMPING, 1);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ROLLING, 2);
    }
  }
}
export class Running extends State {
  constructor(player) {
    super(states.RUNNING, player);
  }
  enter() {
    resetFrames(this.player, 3, 8);
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Dust(this.game, this.player.x + this.player.width / 2, this.player.y + this.player.height)
    );
    handleHorizontalMovement(this.player, input);
    if (input.includes("ArrowDown")) {
      this.player.setState(states.SITTING, 0);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMPING, 1);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ROLLING, 2);
    }
  }
}
export class Jumping extends State {
  constructor(player) {
    super(states.JUMPING, player);
  }
  enter() {
    if (this.player.onGround()) this.player.vy = -27;
    resetFrames(this.player, 1, 6);
  }
  handleInput(input) {
    handleHorizontalMovement(this.player, input);
    if (this.player.vy > this.player.weight) {
      this.player.setState(states.FALLING, 1);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ROLLING, 2);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.DIVING, 0);
    }
  }
}
export class Falling extends State {
  constructor(player) {
    super(states.FALLING, player);
  }
  enter() {
    resetFrames(this.player, 2, 6);
  }
  handleInput(input) {
    handleHorizontalMovement(this.player, input);
    if (this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.DIVING, 0);
    }
  }
}
export class Rolling extends State {
  constructor(player) {
    super(states.ROLLING, player);
  }
  enter() {
    resetFrames(this.player, 6, 6);
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Fire(this.game, this.player.x + this.player.width * 0.5, this.player.y + this.player.height * 0.5)
    );
    handleHorizontalMovement(this.player, input);
    if (!input.includes("Enter") && this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
    } else if (!input.includes("Enter") && !this.player.onGround()) {
      this.player.setState(states.FALLING, 1);
    } else if (input.includes("Enter") && input.includes("ArrowUp") && this.player.onGround()) {
      this.player.vy -= 27;
    } else if (input.includes("ArrowDown") && !this.player.onGround()) {
      this.player.setState(states.DIVING, 0);
    }
  }
}
export class Diving extends State {
  constructor(player) {
    super(states.DIVING, player);
  }
  enter() {
    resetFrames(this.player, 6, 6);
    this.game.player.vy = 15;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Fire(this.game, this.player.x + this.player.width * 0.5, this.player.y + this.player.height * 0.5)
    );
    // handleHorizontalMovement(this.player, input);
    if (this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(
          new Splash(this.game, this.player.x + this.player.width * 0.6, this.player.y + this.player.height * 1)
        );
      }
    } else if (input.includes("Enter") && this.player.onGround()) {
      this.player.setState(states.ROLLING, 2);
    }
  }
}
export class Hit extends State {
  constructor(player) {
    super(states.HIT, player);
  }
  enter() {
    resetFrames(this.player, 4, 10);
  }
  handleInput(input) {
    if (this.player.frameX >= 10 && this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
    } else if (this.player.frameX >= 10 && !this.player.onGround()) {
      this.player.setState(states.FALLING, 1);
    }
  }
}

function resetFrames(player, frameY, maxFrame) {
  player.frameX = 0;
  player.frameY = frameY;
  player.maxFrame = maxFrame;
}

function handleHorizontalMovement(player, input) {
  // horizontal movement
  if (input.includes("ArrowRight") && input.includes("ArrowLeft")) {
    player.speed = 0;
  } else if (input.includes("ArrowRight")) {
    player.speed = player.maxSpeed;
  } else if (input.includes("ArrowLeft")) {
    player.speed = -player.maxSpeed;
  } else {
    player.speed = 0;
  }
}
