import { createAnimation } from './anim';
import { Entity } from './classes/Entity';
import { Jump } from './classes/traits/Jump';
import { Walk } from './classes/traits/Walk';
import { loadSpriteSheet } from './loaders';

export async function createMario() {
  const sprite = await loadSpriteSheet('mario');
  const mario = new Entity();
  mario.size.set(14, 16);

  mario.addTrait(new Walk());
  mario.addTrait(new Jump());

  const runAnim = createAnimation(['run-1', 'run-2', 'run-3'], 10);

  function routeFrame(entity: Entity) {
    if (entity.walk.direction !== 0) {
      return runAnim(entity.walk.distance);
    }
    return 'idle';
  }

  mario.draw = function(ctx) {
    sprite.draw(routeFrame(mario), ctx, 0, 0, mario.walk.heading < 0);
  };

  return mario;
}
