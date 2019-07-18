import { Entity, Sides, Trait } from '../Entity';

export class PendulumMove extends Trait {
  speed = -30;
  enabled = true;

  constructor() {
    super('pendulumMove');
  }

  obstruct(entity: Entity, side: Sides) {
    if (side === 'left' || side === 'right') {
      this.speed = -this.speed;
    }
  }
  update(entity: Entity) {
    if (this.enabled) {
      entity.vel.x = this.speed;
    }
  }
}
