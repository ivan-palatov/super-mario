import { Compositor } from './Compositor';
import { Entity } from './Entity';
import { EntityCollider } from './EntityCollider';
import { Matrix } from './math';
import { TileCollider } from './TileCollider';

export class Level {
  private readonly gravity = 1500;

  totalTime = 0;
  comp = new Compositor();
  entities = new Set<Entity>();
  tileCollider: TileCollider | null = null;
  entityCollider: EntityCollider = new EntityCollider(this.entities);

  setCollisionGrid(matrix: Matrix) {
    this.tileCollider = new TileCollider(matrix);
  }

  update(delta: number) {
    this.entities.forEach(entity => {
      entity.update(delta, this);
      // Apply velocity and handle tile collisions
      entity.pos.x += entity.vel.x * delta;
      this.tileCollider!.checkX(entity);
      entity.pos.y += entity.vel.y * delta;
      this.tileCollider!.checkY(entity);
      // Apply gravity
      entity.vel.y += this.gravity * delta;
    });

    // Entity collision check
    // If do that in prev. loop, race condition
    this.entities.forEach(entity => {
      this.entityCollider.check(entity);
    });

    this.totalTime += delta;
  }
}
