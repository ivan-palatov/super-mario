import { Entity, Trait } from '../Entity';

export class Walk extends Trait {
  direction = 0;
  speed = 6000;

  constructor() {
    super('walk');
  }

  update(entity: Entity, deltaTime: number) {
    entity.vel.x = this.speed * this.direction * deltaTime;
  }
}
