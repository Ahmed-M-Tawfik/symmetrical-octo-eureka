import type { IKeyBinding } from "../data/ConfigTypes";

export class KeyBindings {
  keyToAction: Record<string, KeyBinding>;
  actionToKey: Record<string, KeyBinding>;

  constructor(bindings: IKeyBinding[]) {
    this.keyToAction = {};
    this.actionToKey = {};
    for (const { action, key, group } of bindings) {
      const binding = new KeyBinding(action, key, group);
      this.keyToAction[key] = this.actionToKey[action] = binding;
    }
  }

  addKeyBinding(action: string, key: string, group: string): void {
    const binding = new KeyBinding(action, key, group);
    this.keyToAction[key] = this.actionToKey[action] = binding;
  }

  getKeysByGroup(group: string): string[] {
    return Object.values(this.keyToAction)
      .filter((binding) => binding.group === group)
      .map((binding) => binding.key);
  }
}

export class KeyBinding implements IKeyBinding {
  action: string;
  key: string;
  group: string;

  constructor(action: string, key: string, group: string) {
    this.action = action;
    this.key = key;
    this.group = group;
  }
}
