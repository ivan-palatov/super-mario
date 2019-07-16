import { Compositor } from './Compositor';
import { Entity } from './Entity';
import { Matrix } from './math';
import { TileCollider } from './TileCollider';

export class Level {
  private readonly gravity = 2000;

  totalTime = 0;

  comp = new Compositor();
  entities = new Set<Entity>();
  tiles = new Matrix();
  tileCollider = new TileCollider(this.tiles);

  update(delta: number) {
    this.entities.forEach(entity => {
      entity.update(delta);
      // Apply velocity and handle collisions
      entity.pos.x += entity.vel.x * delta;
      this.tileCollider.checkX(entity);
      entity.pos.y += entity.vel.y * delta;
      this.tileCollider.checkY(entity);
      // Apply gravity
      entity.vel.y += this.gravity * delta;
    });

    this.totalTime += delta;
  }
}
