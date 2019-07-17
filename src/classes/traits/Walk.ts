import { Entity, Trait } from '../Entity';

export class Walk extends Trait {
  direction = 0;
  acceleration = 400;
  deceleration = 300;
  dragFactor = 1 / 5000;

  distance = 0;
  heading = 1;

  constructor() {
    super('walk');
  }

  update(entity: Entity, deltaTime: number) {
    const absX = Math.abs(entity.vel.x);

    if (this.direction !== 0) {
      entity.vel.x += this.acceleration * this.direction * deltaTime;

      if (entity.jump) {
        if (entity.jump.falling === false) {
          this.heading = this.direction;
        }
      } else {
        this.heading = this.direction;
      }
    } else if (entity.vel.x !== 0) {
      const decel = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;
    this.distance += absX * deltaTime;
  }
}
