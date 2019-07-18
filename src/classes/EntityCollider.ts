import { Entity } from './Entity';

export class EntityCollider {
  constructor(private entities: Set<Entity>) {}

  check(subject: Entity) {
    this.entities.forEach(entity => {
      if (subject === entity) return;
      if (subject.bounds.overlaps(entity.bounds)) {
        subject.collides(entity);
        entity.collides(subject);
      }
    });
  }
}
