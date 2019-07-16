import { Compositor } from './Compositor';
import { Entity } from './Entity';
import { Matrix } from './math';

export class Level {
  comp = new Compositor();
  entities = new Set<Entity>();
  tiles = new Matrix();

  update(delta: number) {
    this.entities.forEach(entity => {
      entity.update(delta);
    });
  }
}
