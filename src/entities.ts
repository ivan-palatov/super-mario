import { createAnimation } from './anim';
import { Entity } from './classes/Entity';
import { Jump } from './classes/traits/Jump';
import { Walk } from './classes/traits/Walk';
import { loadSpriteSheet } from './loaders';

export const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

export async function createMario() {
  const sprite = await loadSpriteSheet('mario');
  const mario = new Entity();
  mario.size.set(14, 16);

  mario.addTrait(new Walk());
  mario.addTrait(new Jump());
  mario.turbo = function(turboOn: number) {
    this.walk.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  };

  const runAnim = createAnimation(['run-1', 'run-2', 'run-3'], 6);

  function routeFrame(entity: Entity) {
    if (entity.jump.falling) {
      return 'jump';
    }
    if (entity.walk.distance > 0) {
      if (
        (entity.vel.x > 0 && entity.walk.direction < 0) ||
        (entity.vel.x < 0 && entity.walk.direction > 0)
      ) {
        return 'break';
      }
      return runAnim(entity.walk.distance);
    }
    return 'idle';
  }

  mario.draw = function(ctx) {
    sprite.draw(routeFrame(mario), ctx, 0, 0, mario.walk.heading < 0);
  };

  return mario;
}
