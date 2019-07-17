import { Entity, Sides, Trait } from '../Entity';

export class PendulumWalk extends Trait {
  speed = -30;

  constructor() {
    super('pendulumWalk');
  }

  obstruct(entity: Entity, side: Sides) {
    if (side === 'left' || side === 'right') {
      this.speed = -this.speed;
    }
  }
  update(entity: Entity) {
    entity.vel.x = this.speed;
  }
}
