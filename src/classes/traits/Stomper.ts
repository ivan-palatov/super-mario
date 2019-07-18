import { Entity, Trait } from '../Entity';

export class Stomper extends Trait {
  bounceSpeed = 400;

  constructor() {
    super('stomper');
  }

  bounce(us: Entity, them: Entity) {
    if (them.killable.dead) return;
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -this.bounceSpeed;
  }

  collides(us: Entity, them: Entity) {
    if (!them.killable || us.vel.y <= them.vel.y) return;
    this.bounce(us, them);
  }
}
