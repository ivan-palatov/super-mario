import { Entity, Trait } from '../Entity';

export class Stomper extends Trait {
  queueBounce = false;
  bounceSpeed = 400;

  constructor() {
    super('stomper');
  }

  bounce() {
    this.queueBounce = true;
  }

  update(entity: Entity) {
    if (!this.queueBounce) return;
    entity.vel.y = -this.bounceSpeed;
    this.queueBounce = false;
  }
}
