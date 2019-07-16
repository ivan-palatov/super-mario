import { Entity, Sides, Trait } from '../Entity';

export class Jump extends Trait {
  duration = 0.3;
  velocity = 200;
  engageTime = 0;
  ready = 0;
  requestTime = 0;
  gracePeriod = 0.1;
  speedBoost = 0.3;

  constructor() {
    super('jump');
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  obstruct(entity: Entity, side: Sides) {
    if (side === 'bottom') {
      this.ready = 1;
    } else if (side === 'top') {
      this.cancel();
    }
  }

  update(entity: Entity, deltaTime: number) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
      }
      this.requestTime -= deltaTime;
    }
    if (this.engageTime > 0) {
      entity.vel.y = -(
        this.velocity + Math.abs(entity.vel.x * this.speedBoost)
      );
      this.engageTime -= deltaTime;
    }
    this.ready--;
  }
}
