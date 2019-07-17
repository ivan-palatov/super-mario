import { Context } from '../common/interfaces';
import { BoundingBox } from './BoundingBox';
import { Vec2 } from './math';

export type Sides = 'top' | 'bottom' | 'left' | 'right';

export class Trait {
  constructor(public readonly name: string) {}

  update(entity: Entity, deltaTime: number) {
    console.warn('Unhandled update call in Trait class.');
  }

  obstruct(entity: Entity, side: Sides) {
    //
  }
}

export class Entity {
  pos = new Vec2(0, 0);
  vel = new Vec2(0, 0);
  size = new Vec2(0, 0);
  offset = new Vec2(0, 0);

  bounds = new BoundingBox(this.pos, this.size, this.offset);

  lifeTime = 0;

  [x: string]: Trait | any;

  draw: (ctx: Context) => void;

  traits: Trait[] = [];

  update = (deltaTime: number) => {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime);
    });

    this.lifeTime += deltaTime;
  };

  addTrait(trait: Trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  obstruct(side: Sides) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side);
    });
  }
}
