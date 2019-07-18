import { IRes } from '../../common/interfaces';
import { Entity, Sides, Trait } from '../Entity';

export class Solid extends Trait {
  obstructs = true;

  constructor() {
    super('solid');
  }
  obstruct(entity: Entity, side: Sides, match: IRes) {
    if (!this.obstructs) return;

    switch (side) {
      case 'bottom':
        entity.bounds.bottom = match.y1;
        entity.vel.y = 0;
        return;
      case 'top':
        entity.bounds.top = match.y2;
        entity.vel.y = 0;
        return;
      case 'left':
        entity.bounds.left = match.x2;
        entity.vel.x = 0;
        return;
      case 'right':
        entity.bounds.right = match.x1;
        entity.vel.x = 0;
        return;
      default:
        throw new Error("Solid trait -> obstruct didn't get side.");
    }
  }
}
