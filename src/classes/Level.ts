import { Compositor } from './Compositor';
import { Entity } from './Entity';
import { EntityCollider } from './EntityCollider';
import { Matrix } from './math';
import { TileCollider } from './TileCollider';

export class Level {
  readonly gravity = 1500;

  totalTime = 0;
  comp = new Compositor();
  entities = new Set<Entity>();
  tileCollider: TileCollider | null = null;
  entityCollider: EntityCollider = new EntityCollider(this.entities);

  setCollisionGrid(matrix: Matrix) {
    this.tileCollider = new TileCollider(matrix);
  }

  update(deltaTime: number) {
    this.entities.forEach(entity => {
      entity.update(deltaTime, this);
    });
    // If do that in prev. loop, race condition
    this.entities.forEach(entity => {
      this.entityCollider.check(entity);
    });

    // Do all enqueued tasks in each entity trait
    this.entities.forEach(entity => {
      entity.finalize();
    });

    this.totalTime += deltaTime;
  }
}
