import { Entity, Trait } from '../Entity';

export class Walk extends Trait {
  direction = 0;
  speed = 6000;
  distance = 0;
  heading = 1;

  constructor() {
    super('walk');
  }

  update(entity: Entity, deltaTime: number) {
    entity.vel.x = this.speed * this.direction * deltaTime;

    if (this.direction) {
      this.heading = this.direction;
      this.distance += Math.abs(entity.vel.x) * deltaTime;
    } else {
      this.direction = 0;
    }
  }
}
