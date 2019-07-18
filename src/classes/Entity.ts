import { Context } from '../common/interfaces';
import { BoundingBox } from './BoundingBox';
import { Level } from './Level';
import { Vec2 } from './math';

export type Sides = 'top' | 'bottom' | 'left' | 'right';

export class Trait {
  constructor(public readonly name: string) {}

  update(entity: Entity, deltaTime: number, level: Level) {}

  obstruct(entity: Entity, side: Sides) {}

  collides(us: Entity, them: Entity) {}
}

export class Entity {
  pos = new Vec2(0, 0);
  vel = new Vec2(0, 0);
  size = new Vec2(0, 0);
  offset = new Vec2(0, 0);

  bounds = new BoundingBox(this.pos, this.size, this.offset);

  canCollide = true;
  lifeTime = 0;

  [x: string]: Trait | any;

  traits: Trait[] = [];

  draw(ctx: Context) {}

  update(deltaTime: number, level: Level) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime, level);
    });
    this.lifeTime += deltaTime;
  }

  addTrait(trait: Trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  obstruct(side: Sides) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side);
    });
  }

  collides(candidate: Entity) {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }
}
