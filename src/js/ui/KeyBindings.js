export class KeyBindings {
  /**
   * @param {[{ action: string, key: string, group: string }]} bindings
   */
  constructor(bindings = []) {
    this.keyToAction = {};
    this.actionToKey = {};

    for (const { action, key, group } of bindings) {
      const binding = new KeyBinding(action, key, group);
      this.keyToAction[key] = this.actionToKey[action] = binding;
    }
  }
  addKeyBinding(action, key, group) {
    const binding = new KeyBinding(action, key, group);
    this.keyToAction[key] = this.actionToKey[action] = binding;
  }
  getKeysByGroup(group) {
    return Object.values(this.keyToAction)
      .filter((binding) => binding.group === group)
      .map((binding) => binding.key);
  }
}

class KeyBinding {
  constructor(action, key, group) {
    this.action = action;
    this.key = key;
    this.group = group;
  }
}
