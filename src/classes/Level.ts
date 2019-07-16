import { Compositor } from './Compositor';
import { Entity } from './Entity';
import { Matrix } from './math';
import { TileCollider } from './TileCollider';

export class Level {
  comp = new Compositor();
  entities = new Set<Entity>();
  tiles = new Matrix();
  tileCollider = new TileCollider(this.tiles);

  update(delta: number) {
    this.entities.forEach(entity => {
      entity.update(delta);
      entity.pos.x += entity.vel.x * delta;
      this.tileCollider.checkX(entity);
      entity.pos.y += entity.vel.y * delta;
      this.tileCollider.checkY(entity);
    });
  }
}
