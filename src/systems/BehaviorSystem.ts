import type { GameEntity } from "../js/entities/GameEntity";
import { BehaviorComponent } from "../js/entities/components/BehaviorComponent";

export function BehaviorSystem(entity: GameEntity, deltaTime: number) {
  const behavior = entity.getComponent<BehaviorComponent>("behavior");
  if (behavior && behavior.behaviorFn) {
    behavior.behaviorFn(entity, deltaTime);
  }
}
