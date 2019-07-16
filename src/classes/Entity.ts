import { Context } from '../common/interfaces';
import { Vec2 } from './math';

export class Trait {
  constructor(public readonly name: string) {}

  update(entity: Entity, deltaTime: number) {
    console.warn('Unhandled update call in Trait class.');
  }
}

export class Entity {
  pos = new Vec2(0, 0);
  vel = new Vec2(0, 0);
  size = new Vec2(0, 0);

  [x: string]: Trait | any;

  draw: (ctx: Context) => void;

  traits: Trait[] = [];

  update = (deltaTime: number) => {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime);
    });
  };

  addTrait(trait: Trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }
}
