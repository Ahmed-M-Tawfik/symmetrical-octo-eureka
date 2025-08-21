export const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

export const playerActions = {
  moveLeft: "moveLeft",
  moveRight: "moveRight",
  jump: "jump",
  down: "down",
  roll: "roll",
};

class State {
  constructor(state, player) {
    this.state = state;
    this.player = player;
    this.game = player.game;
  }
  enter() {}
  handleInput(inputActions) {}
}
export class Sitting extends State {
  constructor(player) {
    super(states.SITTING, player);
  }
  enter() {
    resetFrames(this.player, 5, 4);
    this.player.speed = 0;
  }
  handleInput(inputActions) {
    if (inputActions.has(playerActions.down)) {
      // no op
      return;
    }
    if (inputActions.has(playerActions.moveLeft) || inputActions.has(playerActions.moveRight)) {
      this.player.setState(states.RUNNING, 1);
    } else if (inputActions.has(playerActions.jump)) {
      this.player.setState(states.JUMPING, 1);
    } else if (inputActions.has(playerActions.roll)) {
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
  handleInput(inputActions) {
    this.game.particleAnimator.addDust(this.player.x + this.player.width * 0.5, this.player.y + this.player.height);
    handleHorizontalMovement(this.player, inputActions);
    if (inputActions.has(playerActions.down)) {
      this.player.setState(states.SITTING, 0);
    } else if (inputActions.has(playerActions.jump)) {
      this.player.setState(states.JUMPING, 1);
    } else if (inputActions.has(playerActions.roll)) {
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
  handleInput(inputActions) {
    handleHorizontalMovement(this.player, inputActions);
    if (this.player.vy > this.player.weight) {
      this.player.setState(states.FALLING, 1);
    } else if (inputActions.has(playerActions.roll)) {
      this.player.setState(states.ROLLING, 2);
    } else if (inputActions.has(playerActions.down)) {
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
  handleInput(inputActions) {
    handleHorizontalMovement(this.player, inputActions);
    if (this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
    } else if (inputActions.has(playerActions.down)) {
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
  handleInput(inputActions) {
    this.game.particleAnimator.addFire(
      this.player.x + this.player.width * 0.5,
      this.player.y + this.player.height * 0.5
    );
    handleHorizontalMovement(this.player, inputActions);
    if (!inputActions.has(playerActions.roll) && this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
    } else if (!inputActions.has(playerActions.roll) && !this.player.onGround()) {
      this.player.setState(states.FALLING, 1);
    } else if (inputActions.has(playerActions.roll) && inputActions.has(playerActions.jump) && this.player.onGround()) {
      this.player.vy -= 27;
    } else if (inputActions.has(playerActions.down) && !this.player.onGround()) {
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
    this.game.player.vy = 30;
  }
  handleInput(inputActions) {
    this.game.particleAnimator.addFire(
      this.player.x + this.player.width * 0.5,
      this.player.y + this.player.height * 0.5
    );
    if (this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
      this.game.particleAnimator.addSplash(this.player.x + this.player.width * 0.6, this.player.y + this.player.height);
    } else if (inputActions.has(playerActions.roll) && this.player.onGround()) {
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
  handleInput(inputActions) {
    if (this.player.spriteData.frameX >= 10 && this.player.onGround()) {
      this.player.setState(states.RUNNING, 1);
    } else if (this.player.spriteData.frameX >= 10 && !this.player.onGround()) {
      this.player.setState(states.FALLING, 1);
    }
  }
}

function resetFrames(player, frameY, maxFrame) {
  player.spriteData.frameX = 0;
  player.spriteData.frameY = frameY;
  player.spriteData.maxFrame = maxFrame;
}

function handleHorizontalMovement(player, inputActions) {
  // horizontal movement
  if (inputActions.has(playerActions.moveRight) && inputActions.has(playerActions.moveLeft)) {
    player.speed = 0;
  } else if (inputActions.has(playerActions.moveRight)) {
    player.speed = player.maxSpeed;
  } else if (inputActions.has(playerActions.moveLeft)) {
    player.speed = -player.maxSpeed;
  } else {
    player.speed = 0;
  }
}
