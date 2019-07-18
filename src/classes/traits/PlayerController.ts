import { Entity, Trait } from '../Entity';
import { Level } from '../Level';
import { Vec2 } from '../math';

export class PlayerController extends Trait {
  player: Entity | null = null;
  checkPoint = new Vec2(0, 0);

  constructor() {
    super('playerController');
  }

  setPlayer(entity: Entity) {
    this.player = entity;
  }

  update(entity: Entity, deltaTime: number, level: Level) {
    if (level.entities.has(this.player!)) return;
    this.player!.killable.revive();
    this.player!.pos.set(this.checkPoint.x, this.checkPoint.y);
    level.entities.add(this.player!);
  }
}