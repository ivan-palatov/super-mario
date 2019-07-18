import { Context, IRes } from '../common/interfaces';
import { BoundingBox } from './BoundingBox';
import { Level } from './Level';
import { Vec2 } from './math';

export type Sides = 'top' | 'bottom' | 'left' | 'right';

export class Trait {
  tasks: Array<() => any> = [];

  constructor(public readonly name: string) {}

  queue(task: () => any) {
    this.tasks.push(task);
  }

  finalize() {
    this.tasks.forEach(task => task());
    this.tasks.length = 0;
  }

  update(entity: Entity, deltaTime: number, level: Level) {}

  obstruct(entity: Entity, side: Sides, match: IRes) {}

  collides(us: Entity, them: Entity) {}
}

export class Entity {
  pos = new Vec2(0, 0);
  vel = new Vec2(0, 0);
  size = new Vec2(0, 0);
  offset = new Vec2(0, 0);

  bounds = new BoundingBox(this.pos, this.size, this.offset);

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

  obstruct(side: Sides, match: IRes) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side, match);
    });
  }

  collides(candidate: Entity) {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }

  finalize() {
    this.traits.forEach(trait => {
      trait.finalize();
    });
  }
}
